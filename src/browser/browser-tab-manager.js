const path = require('path');
const fs = require('fs');

let instanceId = 0

const Draggabilly = require('draggabilly')

const TAB_CONTENT_MARGIN = 9
const TAB_CONTENT_OVERLAP_DISTANCE = 1

const TAB_CONTENT_MIN_WIDTH = 24
const TAB_CONTENT_MAX_WIDTH = 240

const TAB_SIZE_SMALL = 84
const TAB_SIZE_SMALLER = 60
const TAB_SIZE_MINI = 48

const TAB_CLASS = "chrome-tab";
const DATA_TABS_INSTANCE_ID = "data-chrome-tabs-instance-id";

class ChromeTabs {
	constructor() {
		this.draggabillies = []
	}

	init(el) {
		this.DOM_chrome_tabs = el

		this.instanceId = instanceId
		this.DOM_chrome_tabs.setAttribute(DATA_TABS_INSTANCE_ID, this.instanceId)
		instanceId += 1

		this.setupCustomProperties()
		this.setupStyleEl()
		this.setupEvents()
		this.layoutTabs()
		this.setupDraggabilly()
	}

	emit(eventName, data) {
		this.DOM_chrome_tabs.dispatchEvent(new CustomEvent(eventName, { detail: data }))
	}

	setupCustomProperties() {
		this.DOM_chrome_tabs.style.setProperty('--tab-content-margin', `${TAB_CONTENT_MARGIN}px`)
	}

	setupStyleEl() {
		this.styleEl = document.createElement('style')
		this.DOM_chrome_tabs.appendChild(this.styleEl)
	}

	setupEvents() {
		window.addEventListener('resize', _ => {
			this.cleanUpPreviouslyDraggedTabs()
			this.layoutTabs()
		})

		this.DOM_chrome_tabs.addEventListener('dblclick', event => {
			if ([this.DOM_chrome_tabs, this.tabContentEl].includes(event.target)) this.addTab()
		})

		this.tabEls.forEach((tabEl) => this.setTabCloseEventListener(tabEl))
	}

	get tabEls() {
		return Array.prototype.slice.call(this.DOM_chrome_tabs.querySelectorAll('.' + TAB_CLASS))
	}

	get tabContentEl() {
		return this.DOM_chrome_tabs.querySelector('.chrome-tabs-content')
	}

	get tabContentWidths() {
		const numberOfTabs = this.tabEls.length
		const tabsContentWidth = this.tabContentEl.clientWidth
		const tabsCumulativeOverlappedWidth = (numberOfTabs - 1) * TAB_CONTENT_OVERLAP_DISTANCE
		const targetWidth = (tabsContentWidth - (2 * TAB_CONTENT_MARGIN) + tabsCumulativeOverlappedWidth) / numberOfTabs
		const clampedTargetWidth = Math.max(TAB_CONTENT_MIN_WIDTH, Math.min(TAB_CONTENT_MAX_WIDTH, targetWidth))
		const flooredClampedTargetWidth = Math.floor(clampedTargetWidth)
		const totalTabsWidthUsingTarget = (flooredClampedTargetWidth * numberOfTabs) + (2 * TAB_CONTENT_MARGIN) - tabsCumulativeOverlappedWidth
		const totalExtraWidthDueToFlooring = tabsContentWidth - totalTabsWidthUsingTarget

		// TODO - Support tabs with different widths / e.g. "pinned" tabs
		const widths = []
		let extraWidthRemaining = totalExtraWidthDueToFlooring
		for (let i = 0; i < numberOfTabs; i += 1) {
			const extraWidth = flooredClampedTargetWidth < TAB_CONTENT_MAX_WIDTH && extraWidthRemaining > 0 ? 1 : 0
			widths.push(flooredClampedTargetWidth + extraWidth)
			if (extraWidthRemaining > 0) extraWidthRemaining -= 1
		}

		return widths
	}

	get tabContentPositions() {
		const positions = []
		const tabContentWidths = this.tabContentWidths

		let position = TAB_CONTENT_MARGIN
		tabContentWidths.forEach((width, i) => {
			const offset = i * TAB_CONTENT_OVERLAP_DISTANCE
			positions.push(position - offset)
			position += width
		})

		return positions
	}

	get tabPositions() {
		const positions = []

		this.tabContentPositions.forEach((contentPosition) => {
			positions.push(contentPosition - TAB_CONTENT_MARGIN)
		})

		return positions
	}

	layoutTabs() {
		const tabContentWidths = this.tabContentWidths

		this.tabEls.forEach((tabEl, i) => {
			const contentWidth = tabContentWidths[i]
			const width = contentWidth + (5 * TAB_CONTENT_MARGIN)

			tabEl.style.width = width + 'px'
			tabEl.removeAttribute('is-small')
			tabEl.removeAttribute('is-smaller')
			tabEl.removeAttribute('is-mini')

			if (contentWidth < TAB_SIZE_SMALL) tabEl.setAttribute('is-small', '')
			if (contentWidth < TAB_SIZE_SMALLER) tabEl.setAttribute('is-smaller', '')
			if (contentWidth < TAB_SIZE_MINI) tabEl.setAttribute('is-mini', '')
		})

		let styleHTML = ''
		this.tabPositions.forEach((position, i) => {
			styleHTML += `
        		.chrome-tabs[${DATA_TABS_INSTANCE_ID}="${ this.instanceId }"] .${TAB_CLASS}:nth-child(${ i + 1 }) {
          		transform: translate3d(${ position }px, 0, 0)
        	}`
		})
		this.styleEl.innerHTML = styleHTML
	}

	createNewTabEl(tabPositions) {
		const div = document.createElement('div')
		div.innerHTML = `
		<div class="chrome-tab">
		  <div class="chrome-tab-dividers"></div>
		  <div class="chrome-tab-background">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36"><path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="52%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="36" class="chrome-tab-geometry"/></svg><g transform="scale(-1, 1)"><svg width="52%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="36" class="chrome-tab-geometry"/></svg></g></svg>
		  </div>
		  <div class="chrome-tab-content" data-tab-value="tab_" id="tab_">
			<div class="chrome-tab-favicon"></div>
			<div class="chrome-tab-title"></div>
			<div class="chrome-tab-drag-handle"></div>
			<div class="chrome-tab-close"></div>
		  </div>
		</div>`;
		return div.firstElementChild
		// <img src="${tabPositions.favicon}" style="height:18px;width:25px;"></img>
	}

	addTab(tabProperties, { animate = true, background = false } = {}) {
		const tabEl = this.createNewTabEl(tabProperties)

		if (animate) {
			tabEl.classList.add(`${TAB_CLASS}-was-just-added`)
			setTimeout(() => tabEl.classList.remove(`${TAB_CLASS}-was-just-added`), 500)
		}

		tabProperties = Object.assign({}, defaultTapProperties, tabProperties)
		this.tabContentEl.appendChild(tabEl)
		this.setTabCloseEventListener(tabEl)
		this.updateTab(tabEl, tabProperties)
		this.emit('tabAdd', { tabEl })
		if (!background) this.setCurrentTab(tabEl)
		this.cleanUpPreviouslyDraggedTabs()
		this.layoutTabs()
		this.setupDraggabilly()

		return tabEl
	}

	setTabCloseEventListener(tabEl) {
		tabEl.querySelector(`.${TAB_CLASS}-close`).addEventListener('click', _ => this.removeTab(tabEl))
	}

	get activeTabEl() {
		
		return this.DOM_chrome_tabs.querySelector(`.${TAB_CLASS}[active]`)
	}

	hasActiveTab() {
		return !!this.activeTabEl
	}

	setCurrentTab(tabEl) {
		const activeTabEl = this.activeTabEl
		if (activeTabEl === tabEl) return
		if (activeTabEl) {
			activeTabEl.removeAttribute('active')
			activeTabEl.classList.remove("selected")
		}
		tabEl.setAttribute('active', '')
		tabEl.classList.add("selected")
		this.emit('activeTabChange', { tabEl })
	}

	removeTab(tabEl) {
		if (tabEl === this.activeTabEl) {
			if (tabEl.nextElementSibling) {
				this.setCurrentTab(tabEl.nextElementSibling)
			} else if (tabEl.previousElementSibling) {
				this.setCurrentTab(tabEl.previousElementSibling)
			}
		}
		tabEl.parentNode.removeChild(tabEl)
		this.emit('tabRemove', { tabEl })
		this.cleanUpPreviouslyDraggedTabs()
		this.layoutTabs()
		this.setupDraggabilly()
	}

	updateTab(tabEl, tabProperties) {
		tabEl.querySelector(`.${TAB_CLASS}-title`).textContent = tabProperties.title

		const faviconEl = tabEl.querySelector(`.${TAB_CLASS}-favicon`)
		if (tabProperties.favicon) {
			faviconEl.style.backgroundImage = `url('${tabProperties.favicon}')`
			faviconEl.removeAttribute('hidden', '')
		} else {
			faviconEl.setAttribute('hidden', '')
			faviconEl.removeAttribute('style')
		}

		if (tabProperties.id) {
			tabEl.setAttribute('data-tab-id', tabProperties.id)
		}
	}

	cleanUpPreviouslyDraggedTabs() {
		this.tabEls.forEach((tabEl) => tabEl.classList.remove(`${TAB_CLASS}-was-just-dragged`))
	}

	setupDraggabilly() {
		const tabEls = this.tabEls
		const tabPositions = this.tabPositions

		if (this.isDragging) {
			this.isDragging = false
			this.DOM_chrome_tabs.classList.remove('tabs-is-sorting')
			this.draggabillyDragging.element.classList.remove(`${TAB_CLASS}-is-dragging`)
			this.draggabillyDragging.element.style.transform = ''
			this.draggabillyDragging.dragEnd()
			this.draggabillyDragging.isDragging = false
			this.draggabillyDragging.positionDrag = noop // Prevent Draggabilly from updating tabEl.style.transform in later frames
			this.draggabillyDragging.destroy()
			this.draggabillyDragging = null
		}

		this.draggabillies.forEach(d => d.destroy())

		tabEls.forEach((tabEl, originalIndex) => {
			const originalTabPositionX = tabPositions[originalIndex]
			const draggabilly = new Draggabilly(tabEl, {
				axis: 'x',
				handle: `.${TAB_CLASS}-drag-handle`,
				containment: this.tabContentEl
			})

			this.draggabillies.push(draggabilly)

			draggabilly.on('pointerDown', _ => {
				this.setCurrentTab(tabEl)
			})

			draggabilly.on('dragStart', _ => {
				this.isDragging = true
				this.draggabillyDragging = draggabilly
				tabEl.classList.add(`${TAB_CLASS}-is-dragging`)
				this.DOM_chrome_tabs.classList.add('tabs-is-sorting')
			})

			draggabilly.on('dragEnd', _ => {
				this.isDragging = false
				const finalTranslateX = parseFloat(tabEl.style.left, 10)
				tabEl.style.transform = `translate3d(0, 0, 0)`

				// Animate dragged tab back into its place
				requestAnimationFrame(_ => {
					tabEl.style.left = '0'
					tabEl.style.transform = `translate3d(${finalTranslateX}px, 0, 0)`

					requestAnimationFrame(_ => {
						tabEl.classList.remove(`${TAB_CLASS}-is-dragging`)
						this.DOM_chrome_tabs.classList.remove('tabs-is-sorting')

						tabEl.classList.add(`${TAB_CLASS}-was-just-dragged`)

						requestAnimationFrame(_ => {
							tabEl.style.transform = ''

							this.layoutTabs()
							this.setupDraggabilly()
						})
					})
				})
			})

			draggabilly.on('dragMove', (event, pointer, moveVector) => {
				// Current index be computed within the event since it can change during the dragMove
				const tabEls = this.tabEls
				const currentIndex = tabEls.indexOf(tabEl)

				const currentTabPositionX = originalTabPositionX + moveVector.x
				const destinationIndexTarget = closest(currentTabPositionX, tabPositions)
				const destinationIndex = Math.max(0, Math.min(tabEls.length, destinationIndexTarget))

				if (currentIndex !== destinationIndex) {
					this.animateTabMove(tabEl, currentIndex, destinationIndex)
				}
			})
		})
	}

	animateTabMove(tabEl, originIndex, destinationIndex) {
		if (destinationIndex < originIndex) {
			tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex])
		} else {
			tabEl.parentNode.insertBefore(tabEl, this.tabEls[destinationIndex + 1])
		}
		this.emit('tabReorder', { tabEl, originIndex, destinationIndex })
		this.layoutTabs()
	}
}


const noop = _ => { }

const closest = (value, array) => {
	let closest = Infinity
	let closestIndex = -1

	array.forEach((v, i) => {
		if (Math.abs(value - v) < closest) {
			closest = Math.abs(value - v)
			closestIndex = i
		}
	})

	return closestIndex
}

const tabTemplate = `
<div class="${TAB_CLASS}">
  <div class="${TAB_CLASS}-dividers"></div>
  <div class="${TAB_CLASS}-content">
	<div class="${TAB_CLASS}-favicon"></div>
	<div class="${TAB_CLASS}-title"></div>
	<div class="${TAB_CLASS}-drag-handle"></div>
	<div class="${TAB_CLASS}-close"></div>
  </div>
</div>
`

const defaultTapProperties = {
	title: 'New tab',
	favicon: false
}

var chromeTabs = new ChromeTabs()

class WanroiBrowserTabs {
	DOM_tabs;
	DOM_browser_views;

	accTabId = 0; //Tab id accumulator

	tabs = []
	views = [] 
	tabCounter = 0;

	viewToPush = undefined;

	activeTab = undefined;
	activeView = undefined;

	constructor() {
		this.DOM_tabs = document.querySelector('.chrome-tabs')
		chromeTabs.init(this.DOM_tabs)

		this.DOM_browser_views = document.querySelector(".tab-content");

		this.DOM_tabs.addEventListener("activeTabChange", (event) => {
			let tab = event.detail.tabEl
			let id = tab["data-ectTabId"]
			console.debug("Active tab changed to: ", tab, id)
			
			
			function set_active_webview_and_deselect_others(view, i) {
				if (i == id) {
					view.classList.add("selected");
					this.activeView = view
				} else {
					view.classList.remove("selected");
				}
			}
			var boundFunction = set_active_webview_and_deselect_others.bind(this)

			this.views.forEach(boundFunction)

			this.activeTab = this.tabs[id]
			
				setTimeout(async () => {
					changeUrlOnActiveWebViewChange()
				   }, 1000);
	
		});

		this.DOM_tabs.addEventListener('tabAdd', (event) => {
			let tab = event.detail.tabEl
			let id = this.accTabId++
			tab["data-ectTabId"] = id
			this.tabs.push(tab)
			//console.debug("Tab added:", id, event.detail)

			if(this.viewToPush)
				{this.views.push(this.viewToPush)
				this.tabCounter = this.tabCounter + 1;}
			else {
				throw "View to push is undefined"
			}
		});

		this.DOM_tabs.addEventListener("tabRemove", (event) => {
			let tab = event.detail.tabEl
			let id = tab["data-ectTabId"]
			console.debug("Tab remove: ", id)

			console.debug("Tab array: ", this.views)
			
			this.views[id].remove() //Delete from document
			delete this.views[id] //Delete from array
			this.tabCounter = this.tabCounter - 1;
			console.debug("Tab COUNTER variable : "+this.tabCounter)
			if(this.tabCounter <= 0)
			{
				window.close();
			}
			console.debug("Tab array after delete: ", this.views)
		});
	}

	addTab(title, favicon="", src=undefined,incognito=false) {
		let child = undefined;
		if(src == 'history'){
			const content = fs.readFileSync(path.join(__dirname, "/src/pages/history.html"),'utf8');
			child = document.createElement("div");
			child.innerHTML = content;
			child.classList.add("eb-view");
			child.dataset.eb_view_id = this.accTabId;	
			this.viewToPush = child;
			this.DOM_browser_views.appendChild(child);
			var script = document.createElement("script");
			let jsContent = `function activeMobileMenu(){
				$(".venroi-history-wrapper").addClass("active-mobile-menu")
			}
			function deactiveMobileMenu(){
				$(".venroi-history-wrapper").removeClass("active-mobile-menu")
			}
			$(function() {
				$('.venroi-history-right-content').scroll(function() { 
					var scroll = $('.venroi-history-right-content').scrollTop();
					if (scroll >= 10) {
						$(".venroi-history-header").addClass("shadowHeader");
					}else{
						$(".venroi-history-header").removeClass("shadowHeader");
					}
				});
			});`;
			script.innerHTML = jsContent;
			this.DOM_browser_views.append(script)
			setTimeout(async () => {
				callingRendererFunctionForHistory();
			   }, 2000);
		}
		if(src == 'bookmark'){
			const content = fs.readFileSync(path.join(__dirname, "/src/pages/bookmarks.html"),'utf8');
			child = document.createElement("div");
			child.innerHTML = content;
			child.classList.add("eb-view");
			child.dataset.eb_view_id = this.accTabId;	
			this.viewToPush = child;
			this.DOM_browser_views.appendChild(child);
			var script = document.createElement("script");
			let jsContent = `function activeMobileMenu(){
				$(".venroi-history-wrapper").addClass("active-mobile-menu")
			}
			function deactiveMobileMenu(){
				$(".venroi-history-wrapper").removeClass("active-mobile-menu")
			}
			$(function() {
				$('.venroi-history-right-content').scroll(function() { 
					var scroll = $('.venroi-history-right-content').scrollTop();
					if (scroll >= 10) {
						$(".venroi-history-header").addClass("shadowHeader");
					}else{
						$(".venroi-history-header").removeClass("shadowHeader");
					}
				});
			});`;
			script.innerHTML = jsContent;
			this.DOM_browser_views.append(script)
			setTimeout(async () => {
				callingRendererFunctionForHistory();
			   }, 2000);
		}
		if (src == 'browser') {
			console.debug("Adding webview view")
			//child = document.createElement("webview")
			//child.setAttribute("src", src);
			
			const content = `<webview nodeintegration nodeintegrationinsubframes id="webview${this.accTabId}" src="https://search.wanroi.com/"
			style="display:inline-flex;width:100%;height:100%"></webview>`;
			child = document.createElement("div");
			child.innerHTML = content;
			child.classList.add("eb-view");
			child.dataset.eb_view_id = this.accTabId;	
			this.viewToPush = child;
			this.DOM_browser_views.appendChild(child);
			var script = document.createElement("script");
			let jsContent = undefined;
			if(incognito){
				jsContent = fs.readFileSync(path.join(__dirname, '/../browser/new-tab.js'),'utf8');
			}
			else{
				jsContent = fs.readFileSync(path.join(__dirname, "/src/browser/new-tab.js"),'utf8');
			}
			jsContent = jsContent.replace(/{HEROID}/g, this.accTabId)
			script.innerHTML = jsContent;
			this.DOM_browser_views.append(script)
		}
		let tabEl = chromeTabs.addTab({
			title: title,
			favicon: favicon
		});

		this.activeTab = tabEl;
		this.activeView = child;

		return {
			"tab": tabEl,
			"view": child
		}
	}

	removeCurrentTab() {
		this.activeView.remove()
		chromeTabs.removeTab(this.activeTab)
	
	}

	getCurrent() {
		return {
			"activeTab": this.activeTab,
			"activeWebview": this.activeView
		}
	}

	hideTabsBar() {
		document.getElementById("eb-tabs-bar").style.display = "none";
	}

	showTabsBar() {
		document.getElementById("eb-tabs-bar").style.display = "block";
	}

	updateTab(tabEl,tabProperties){
		chromeTabs.updateTab(tabEl, tabProperties)
	}
	
}

module.exports = WanroiBrowserTabs;
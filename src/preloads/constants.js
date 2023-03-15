const { app, BrowserWindow, BrowserView } = require('@electron/remote');
const { remote, ipcRenderer } = require("electron");

const browserTabManager = new WanroiBrowserTabs();
const helper = new Helper();
const menuButton = document.getElementById("menu-btn");
const minimizeButton = document.getElementById("minimize-btn");
const maxUnmaxButton = document.getElementById("max-unmax-btn");
const closeButton = document.getElementById("close-btn");
const mainReload = document.getElementById("main-reload-btn");
const mainPrevious = document.getElementById("main-previous-btn");
const mainFarward = document.getElementById("main-farward-btn");
const mainSearch = document.getElementById("mainSearch");
const mainBookmark = document.getElementById("mainBookmark");
// const openIncognitoButton = document.getElementById("open-incognito-window");
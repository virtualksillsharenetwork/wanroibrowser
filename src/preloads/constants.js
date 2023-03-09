const { app, BrowserWindow, BrowserView } = require('@electron/remote');
const { remote, ipcRenderer } = require("electron");

const browserTabManager = new WanroiBrowserTabs();
const helper = new Helper();
const menuButton = document.getElementById("menu-btn");
const minimizeButton = document.getElementById("minimize-btn");
const maxUnmaxButton = document.getElementById("max-unmax-btn");
const closeButton = document.getElementById("close-btn");
// const openIncognitoButton = document.getElementById("open-incognito-window");
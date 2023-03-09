const { app, Menu } = require("electron");

function getMenu(webContents){

  const isMac = process.platform === "darwin";
  const template = [
    {
      label: "New tab",
    },
    {
      label: "New window",
    },
    {
      label: "New Incognito window",
    },
    {
      label: "History",
      click() {
        webContents.send(`history-clicked`, {});
      }
    },
    {
      label: "Downloads",
    },
    {
      label: "Bookmarks",
    },
    {
      label: "Exit",
      //role: isMac ? { role: "close" } : { role: "quit" },
    },
    {
      label: "History",
      // submenu: [isMac ? { role: "close" } : { role: "quit" }],
    },
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  return menu;
}


module.exports = {
  getMenu,
};
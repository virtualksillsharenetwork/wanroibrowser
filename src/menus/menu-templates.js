const { app, Menu } = require("electron");

function getMenuTemplate(menu,webContents){

  const isMac = process.platform === "darwin";
  let template = [];

  if(menu == 'mainMenu'){
    template = [
      {
        label: "New tab",
        click() {
          webContents.send(`new-tab`, {});
        }
      },
      {
        label: "New Incognito window",
        click() {
          webContents.send(`incognito-window`, {});
        }
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
    ];
  }
  if(menu == "incognitoMenu"){
    template = [
      {
        label: "New tab",
        click() {
          webContents.send(`new-tab`, {});
        }
      },
      {
        label: "Downloads",
      },
      {
        label: "Bookmarks",
      },
    ];
  }
   
  return template;
}


module.exports = {
  getMenuTemplate,
};
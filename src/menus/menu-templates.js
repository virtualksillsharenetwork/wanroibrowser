const { app, Menu } = require("electron");

function getMenuTemplate(menu,webContents){

  const isMac = process.platform === "darwin";
  let template = [];

  if(menu == 'mainMenu'){
    template = [
      {
        label: "New tab",
        click() {
          webContents.send(`new-tab`, {incognito:false});
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
        label: "Bookmarks",
        click() {
          webContents.send(`bookmark-clicked`, {});
        }
      },
    ];
  }
  if(menu == "incognitoMenu"){
    template = [
      {
        label: "New tab",
        click() {
          webContents.send(`new-tab`, {incognito:true});
        }
      },
      {
        label: "Bookmarks",
        click() {
          webContents.send(`bookmark-clicked`, {});
        }
      },
    ];
  }
   
  return template;
}


module.exports = {
  getMenuTemplate,
};
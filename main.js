const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

//listen
app.on("ready", function () {
  //create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  //
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  //Quit app when closed
  mainWindow.on("closed", function () {
    app.quit();
  });

  //build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //insert menu
  Menu.setApplicationMenu(mainMenu);
});

//handle add window
function createAddWindow() {
  //create new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add shopping list item",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  //
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  //garbage collection
  addWindow.on("close", function () {
    addWindow = null;
  });
}

//add clear quit

//catch item:add
ipcMain.on("item:add", function (e, item) {
  console.log("main.js " + item);
  //event in item
  //coming from addWindow
  //send to main window
  mainWindow.webContents.send("item:add", item);
  addWindow.close();

  //do catch it in mainwondow
});

//create menu template
const mainMenuTemplate = [
  {
    label: "la",
  },
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        accelerator: process.platform == "darwin" ? "Command+A" : "Ctrl+A", //mac for darwin
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Item",
        accelerator: process.platform == "darwin" ? "Command+C" : "Ctrl+C", //mac for darwin
        click() {
          mainWindow.webContents.send("item:clear"); //catch at mainWindow.html
        },
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q", //mac for darwin
        click() {
          app.quit(); //control Q
        },
      },
    ],
  },
];

if (process.platform == "darwin") {
  // mainMenuTemplate.unshift({});
}

// add dev tool item if not in prod
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}

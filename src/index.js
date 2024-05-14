const { app, BrowserWindow, Notification, Tray, Menu } = require("electron");
const path = require("path");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: path.join(__dirname, "img/icon.png"),
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true
        }
    })
    win.loadFile('src/index.html');
    win.setMenuBarVisibility(false);
    win.setTitle("scrumboard");
    win.maximize();
    win.webContents.setWindowOpenHandler((details) => {
        require("electron").shell.openExternal(details.url);
        return { action: 'deny' }
      })

    tray = new Tray(path.join(__dirname, "./img/menuBarIcon.png"));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open',
        click: () => {
          win.show();
        },
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);

    tray.setToolTip('Scrumboard');
    tray.setContextMenu(contextMenu);
    
    tray.on('click', () => {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    });

    win.on('close', (event) => {
      event.preventDefault();
      win.hide();
    });

    app.on('before-quit', () => {
      tray.destroy();
      win.destroy();
    });
}

app.whenReady().then(() => createWindow());
app.setLoginItemSettings({
    openAtLogin: true
})
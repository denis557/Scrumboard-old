const {app, BrowserWindow, Notification} = require("electron");
const path = require("path");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: path.join(__dirname, "img/icon.png")
    })
    win.loadFile('src/index.html');
    win.setMenuBarVisibility(false);
    win.setTitle("scrumboard");
    win.maximize();
}

app.whenReady().then(() => createWindow());
app.on("window-all-closed", () => app.quit());
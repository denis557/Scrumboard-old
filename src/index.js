const {app, BrowserWindow, Notification} = require("electron");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1024,
        height: 768
    })
    win.loadFile('src/index.html');
    win.setMenuBarVisibility(false);
    win.setTitle("scrumboard");
}

app.whenReady().then(() => createWindow());
app.on("window-all-closed", () => app.quit());
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// refresh app when sources are changed
require('electron-reload')(__dirname, {
    electron: require('electron-prebuilt'),
});

let win = null;

app.on('ready', createWindow);

app.on('window-all-closed', () => app.quit());

app.on('activate', function() {
    if (win === null) {
        createWindow();
    }
});

/**
 * Create main window of game
 */
function createWindow() {
    win = new BrowserWindow({
        width: 700,
        height: 700,
        minimizable: false,
        maximizable: false,
        resizable: false,
    });

    // load index.html in window
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
    }));

    // win.webContents.openDevTools();

    // hide menu of chromium
    win.setMenu(null);

    win.on('closed', function() {
        win = null;
    });
}

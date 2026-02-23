import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let tray;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        minWidth: 350,
        minHeight: 500,
        frame: false,
        transparent: true,
        resizable: true,
        hasShadow: true,
        alwaysOnTop: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        show: false,
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTray() {
    // Using a placeholder icon or empty image if no icon exists yet
    const icon = nativeImage.createEmpty();
    tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show NIYATI', click: () => mainWindow.show() },
        { label: 'Minimize to Tray', click: () => mainWindow.hide() },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() },
    ]);

    tray.setToolTip('NIYATI - Your Destiny Dashboard');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers for Window Controls
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});
ipcMain.on('window-close', () => mainWindow.hide()); // Hide instead of close to keep in tray
ipcMain.handle('is-always-on-top', () => mainWindow.isAlwaysOnTop());
ipcMain.on('toggle-always-on-top', () => {
    const isTop = mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(!isTop);
});

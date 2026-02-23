const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    isAlwaysOnTop: () => ipcRenderer.invoke('is-always-on-top'),
    toggleAlwaysOnTop: () => ipcRenderer.send('toggle-always-on-top'),
});

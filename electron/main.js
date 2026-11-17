// Tinitus · Envoltorio de escritorio (Windows / macOS / Linux) con Electron.
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100, height: 800, minWidth: 380, minHeight: 600,
    backgroundColor: '#0e1624', title: 'Tinitus',
    icon: path.join(__dirname, '..', 'www', 'icons', 'icon-512.png'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true,
      backgroundThrottling: false } // mantener el audio con la ventana minimizada
  });
  win.loadFile(path.join(__dirname, '..', 'www', 'index.html'));
  // Enlaces externos en el navegador del sistema
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration in the renderer process
    },
  });

  // Load your HTML file
  mainWindow.loadFile('/Users/anjanisharan/Desktop/RNS/Projects/Toyota Project/Project_MongoDB/index.html');

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create the main window when the app is ready
app.whenReady().then(createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Create a new window when the app is activated (on macOS)
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

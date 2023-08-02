const { BrowserWindow, app, ipcMain, desktopCapturer, screen } = require('electron');
const path = require('path');
const axios = require('axios');

let mainWindow;
let currentApplication = '';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    backgroundColor: "white",
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
      nativeWindowOpen: true,
      preload: path.join(__dirname, 'preload.js'),
      permissions: ['desktopCapturer', 'media', 'getDisplayMedia'],
    },
    icon: path.join(__dirname, './src/assests/images/logo.png')
  });

  mainWindow.loadFile('./index.html');
  return mainWindow;
}

app.commandLine.appendSwitch('disable-web-security');
app.allowRendererProcessReuse = true;

async function captureScreenDetails() {
  try {
    // Get the active screen
    const activeDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());

    // Get the screen type and title
    const screenType = activeDisplay.isBuiltin ? 'Internal' : 'External';
    const screenbound = activeDisplay.bounds;
    const activeApplication = mainWindow.getTitle();

    if (activeApplication !== currentApplication) {
      console.log(activeApplication);
      console.log(screenType);

      // Make API call to update Django backend
      await axios.post('https://your-django-api-endpoint', {
        screenType,
        screenTitle: activeApplication
      });

      currentApplication = activeApplication;
      console.log('Screen details captured and API call successful');
    }
  } catch (error) {
    console.error('Error capturing screen details or making API call:', error);
  }
}

app.whenReady().then(() => {
  const mainWindow = createWindow();
  mainWindow.webContents.openDevTools(); // Open DevTools for the main process

  // Event listener for when the screen changes
  screen.on('display-added', captureScreenDetails);
  screen.on('display-removed', captureScreenDetails);
  screen.on('display-metrics-changed', captureScreenDetails);
});

app.on('browser-window-focus', captureScreenDetails);

ipcMain.on('capture-screenshot', async (event) => {
  const dataURL = await captureScreen();
  mainWindow.webContents.send('dataFromMain', dataURL);
});

async function captureScreen() {
  try {
    // Get the primary display
    const primaryDisplay = screen.getPrimaryDisplay();

    // Get its size
    const { width, height } = primaryDisplay.size;

    // Set up the options for the desktopCapturer
    const options = {
      types: ['screen'],
      thumbnailSize: { width, height },
    };

    // Get the sources
    const sources = await desktopCapturer.getSources(options);

    // Find the primary display's source
    const primarySource = sources.find(source => source.name === 'Entire Screen');

    // Check if primarySource is defined
    if (!primarySource) {
      throw new Error('Primary source not found');
    }

    // Check if primarySource has a thumbnail property
    if (!primarySource.thumbnail) {
      throw new Error('Thumbnail not available');
    }

    // Get the image as a Buffer
    const buffer = primarySource.thumbnail.toPNG();

    // Convert the Buffer to base64
    const base64Image = buffer.toString('base64');

    // Construct the data URL
    const dataURL = `data:image/png;base64,${base64Image}`;

    // Return the data URL
    return dataURL;
  } catch (error) {
    console.error('Error capturing screen:', error);
    throw error;
  }
}

app.on('ready', () => {
  const mainWindow = createWindow();
  mainWindow.webContents.openDevTools(); // Open DevTools for the main process
});

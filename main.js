const {
  BrowserWindow,
  app,
  ipcMain,
  desktopCapturer,
  screen,
  globalShortcut,
} = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 950,
    backgroundColor: "white",
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
      nativeWindowOpen: true,
      preload: path.join(__dirname, "preload.js"),
      permissions: ["desktopCapturer", "media", "getDisplayMedia"],
    },
    icon: path.join(__dirname, "./src/assests/images/logo.png"),
  });

  mainWindow.loadFile("./index.html");
  // globalShortcut.register('CommandOrControl+R', () => {});
  // globalShortcut.register('F5', () => {});
  
  return mainWindow;
}

app.commandLine.appendSwitch("disable-web-security");
app.allowRendererProcessReuse = true;
let isRecording = false;

ipcMain.on("capture-screenshot", async (event) => {
  const dataURL = await captureScreen();
  mainWindow.webContents.send("dataFromMain", dataURL);
  // console.log(screenShotInfo);
  // window.electronAPI.receiveDataFromMain('dataFromMain', dataURL);
  // mainWindow.webContents.send('screenshot', screenShotInfo);
  // event.sender.send('screenshot', screenShotInfo);
});

ipcMain.on("capture-details", async (event) => {
 console.log("start tasking")
  isRecording = true;
  // console.log(screenShotInfo);
  // window.electronAPI.receiveDataFromMain('dataFromMain', dataURL);
  // mainWindow.webContents.send('screenshot', screenShotInfo);
  // event.sender.send('screenshot', screenShotInfo);
});
ipcMain.on("stop-tasking", async (event) => {
  console.log("stoped tasking")
  isRecording = false;
  // console.log(screenShotInfo);
  // window.electronAPI.receiveDataFromMain('dataFromMain', dataURL);
  // mainWindow.webContents.send('screenshot', screenShotInfo);
  // event.sender.send('screenshot', screenShotInfo);
});

async function captureScreen() {
  try {
    // Get the primary display
    const primaryDisplay = screen.getPrimaryDisplay();

    // Get its size
    const { width, height } = primaryDisplay.size;

    // Set up the options for the desktopCapturer
    const options = {
      types: ["screen"],
      thumbnailSize: { width, height },
    };

    // Get the sources
    const sources = await desktopCapturer.getSources(options);

    // Find the primary display's source
    const primarySource = sources.find(
      (source) => source.name === "Entire Screen"
    );

    // Check if primarySource is defined
    if (!primarySource) {
      throw new Error("Primary source not found");
    }

    // Check if primarySource has a thumbnail property
    if (!primarySource.thumbnail) {
      throw new Error("Thumbnail not available");
    }

    // Get the image as a Buffer
    const buffer = primarySource.thumbnail.toPNG();

    // Convert the Buffer to base64
    const base64Image = buffer.toString("base64");

    // Construct the data URL
    const dataURL = `data:image/png;base64,${base64Image}`;
    // console.log(dataURL);

    // Return the data URL
    return dataURL;
  } catch (error) {
    console.error("Error capturing screen:", error);
    throw error;
  }
}

let screenSwitchesCount = 0;
let currentScreenId = "";

async function printing() {
  if (isRecording) {
    data1 = {
      'screenswitchcount':screenSwitchesCount,
      'screenname':currentScreenId,
    }
    mainWindow.webContents.send("screendata", data1 );
  } else {
    console.log("User is logged out");
  }
}

// contextBridge.exposeInMainWorld('electronAPI', {
//   captureScreenDetails: captureScreenDetails
// });
app.on("ready", () => {
  // Check for screen switches at a regular interval
  setInterval(async () => {
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
    const newScreenId = sources[1].name;
    if (newScreenId !== currentScreenId && newScreenId !== "Task Switching") {
      screenSwitchesCount++;
      currentScreenId = newScreenId;
      printing();
    }

    // for (const source of sources) {
    //   console.log("Window: ", source.id, source.name);
    // }
  }, 2000);

  const mainWindow = createWindow();
  mainWindow.webContents.openDevTools(); // Open DevTools for the main process
});

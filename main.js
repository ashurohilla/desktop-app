const {
  BrowserWindow,
  app,
  ipcMain,
  desktopCapturer,
  screen,
  globalShortcut,
  powerMonitor,
  powerSaveBlocker,
  dialog,
} = require("electron");
const path = require("path");

  // Block the system from entering low-power (sleep) mode
const PowerSaverid = powerSaveBlocker.start('prevent-app-suspension');
console.log(PowerSaverid)

let mainWindow;
let idleTimeInterval;


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    backgroundColor: "white",
    autoHideMenuBar: true,
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      contextIsolation: true,
      nativeWindowOpen: true,
      preload: path.join(__dirname, "preload.js"),
      permissions: ["desktopCapturer", "media", "getDisplayMedia"],
    },
    webSecurity: false,
    icon: path.join(__dirname, "./src/components/dashboard/logo.png"),
  });

  mainWindow.removeMenu();
  mainWindow.loadFile("./index.html");
  globalShortcut.register('CommandOrControl+t', () => {});
  globalShortcut.register('F5', () => {});
  
  return mainWindow;

}



let idleTimeDuration = 1000;


app.commandLine.appendSwitch("disable-web-security");
app.allowRendererProcessReuse = true;
let isRecording = false;
let isIdlePeriodTracking = false;

let startTime = 0; // To track the start time of recording
let elapsedTime = 0; // To track the elapsed time in seconds
let elapsedSeconds =0;
function formatTime(seconds) {
  const pad = (value) => (value < 10 ? `0${value}` : value);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

ipcMain.on("capture-screenshot", async (event) => {
  const dataURL = await captureScreen();
  mainWindow.webContents.send("dataFromMain", dataURL);
  // console.log(screenShotInfo);
  // window.electronAPI.receiveDataFromMain('dataFromMain', dataURL);
  // mainWindow.webContents.send('screenshot', screenShotInfo);
  // event.sender.send('screenshot', screenShotInfo);
});

let intervalId = null;
let hasStartedTimer = false;

async function startRecordingTimer(isRecording) {
  if (isRecording && !hasStartedTimer) {
    intervalId = setInterval(() => {
      elapsedTime++;
      mainWindow.webContents.send("elapsedtiming", elapsedTime);
    }, 910);

    hasStartedTimer = true;
  } else if (!isRecording && hasStartedTimer) {
    clearInterval(intervalId);
    hasStartedTimer = false;
  }
}

function callapi(idleTime) {
  mainWindow.webContents.send("ideltiming", idleTime);

}




ipcMain.on("capture-details", async (event, arg) => {
clearInterval(idleTimeInterval);
 console.log("start tasking")  
 isRecording = true;
 startRecordingTimer(isRecording)
 isIdlePeriodTracking = true;// Record the start time when recording begins
  
  startTime = Date.now(); 

  if(isIdlePeriodTracking == true || isIdlePeriodTracking == 'true'){
      idleTimeInterval = setInterval(() => {
      let idleTime = powerMonitor.getSystemIdleTime();
      // console.log(idleTime);
      if(idleTime == idleTimeDuration){
        idleMessageAlert(idleTime);
        callapi(idleTime);
      }else if(((idleTime - idleTimeDuration)%60 == 0) && ((idleTime - idleTimeDuration)>0)){
        
   
      }
       
    }, 10000);  
  }


function idleMessageAlert(time){
  try {
    let response = dialog.showMessageBox({
      type: 'question',
      buttons: ['Ok'],
      title: 'Diana sentinel',
      message: "We haven't seen any activity from you in the last "+formatTime(time)+" hours. Please switch to break if you are not working."
    });
    // console.log(response);
  } catch (error) {
  console.log(error)
  }
}











//   if (isIdlePeriodTracking) {
//   let idleTimeInterval = setInterval(() => {
//     let idleTime = powerMonitor.getSystemIdleTime();
    
//     if (idleTime >= idleTimeDuration) {
//       console.log("Idle time completed");
//       clearInterval(idleTimeInterval);
//     }
//   }, 100);
// }
});


ipcMain.on("stop-tasking", async (event) => {
  console.log("stoped tasking")
  clearInterval(idleTimeInterval);
  isRecording = false;
  
  isIdlePeriodTracking = false;// Record the start time when recording begins
  startRecordingTimer(isRecording)
  const endTime = Date.now();
  const elapsedMilliseconds = endTime - startTime;
  elapsedSeconds += Math.floor(elapsedMilliseconds / 1000);
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

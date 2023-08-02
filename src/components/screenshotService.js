let ipcRenderer;

if (window.require) {
  const electron = window.require('electron');
  ipcRenderer = electron.ipcRenderer;
}

async function captureAndSendScreenshot() {
  if (!ipcRenderer) {
    throw new Error('Capture and send screenshot is only available in Electron environment');
  }

  return new Promise((resolve, reject) => {
    ipcRenderer.send('capture-screenshot');

    ipcRenderer.on('screenshot-captured', (event, message) => {
      resolve(message);
    });

    ipcRenderer.on('screenshot-error', (event, message) => {
      reject(message);
    });
  });
}

export default captureAndSendScreenshot;

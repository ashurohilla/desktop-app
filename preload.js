const { contextBridge, ipcRenderer } = require('electron');

// Expose APIs and methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendDataToMain: (data) => {
    ipcRenderer.send('capture-screenshot', data);
  },
  sendDatafortasking: (data) => {
    ipcRenderer.send('capture-details', data);
  },
  receiveDataFromMain: (callback) => {
    ipcRenderer.on('dataFromMain', (event, dataURL) => {
      callback(dataURL);
    });
  },
  receivescrendata: (callback) => {
    ipcRenderer.on('screendata', (event, newdata , ) => {
      callback(newdata);
    });
  },
  sendDataforstop: (data) => {
    ipcRenderer.send('stop-tasking', data);
  },
});

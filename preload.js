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
  getelapsedtime: (callback) => {
    ipcRenderer.on('elapsedtiming', (event, elapsedTime , ) => {
      callback(elapsedTime);
    });
  },
  getideltime: (callback) => {
    ipcRenderer.on('ideltiming', (event, ideltime , ) => {
      callback(ideltime);
    });
  },
  sendDataforstop: (data) => {
    ipcRenderer.send('stop-tasking', data);
  },
});

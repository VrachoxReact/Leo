const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  addBoxer: (boxerData) => ipcRenderer.invoke("add-boxer", boxerData),
  getBoxers: () => ipcRenderer.invoke("get-boxers"),
  deleteBoxer: (id) => ipcRenderer.invoke("delete-boxer", id),
});

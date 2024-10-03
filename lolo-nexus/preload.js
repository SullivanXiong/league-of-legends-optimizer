const { contextBridge, ipcRenderer } = require("electron");

console.log("preload.js loaded"); // Add this to verify if preload.js is loaded

// Expose the `getRiotData` function to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  onMatchHistoryUpdate: (callback) => ipcRenderer.on("match-history-updated", callback),
  googleOAuth: () => ipcRenderer.invoke("google-oauth"),
  submitData: (data) => ipcRenderer.invoke("submit-data", data),
  getGameDetails: (gameId) => ipcRenderer.invoke("get-game-details", gameId), // Expose getGameDetails
});

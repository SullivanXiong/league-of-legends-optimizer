const { contextBridge, ipcRenderer } = require("electron");

// Expose the `getRiotData` function to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  onMatchHistoryUpdate: (callback) =>
    ipcRenderer.on("match-history-updated", callback),
  googleOAuth: () => ipcRenderer.invoke("google-oauth"),
  submitData: (data) => ipcRenderer.invoke("submit-data", data),
  getGameDetails: (gameId) => ipcRenderer.invoke("get-game-details", gameId), // Expose getGameDetails
  syncTokens: (idToken, accessToken, refreshToken) =>
    ipcRenderer.send("sync-tokens", { idToken, accessToken, refreshToken }),
  sendOAuthStart: () => ipcRenderer.send("oauth-start"),
  sendAuthCode: (authCode) => ipcRenderer.send("auth-code", authCode), // Send auth code to main process
  onOAuthSuccess: (callback) => ipcRenderer.on("oauth-success", callback),
  onOAuthError: (callback) => ipcRenderer.on("oauth-error", callback),
});

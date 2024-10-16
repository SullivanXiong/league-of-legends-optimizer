const { contextBridge, ipcRenderer } = require("electron");

// Expose the `getRiotData` function to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  onMatchHistoryUpdate: (callback) => ipcRenderer.on("match-history-updated", callback),
  googleOAuth: () => ipcRenderer.invoke("google-oauth"),
  submitData: (data) => ipcRenderer.invoke("submit-data", data),
  getGameDetails: (gameId) => ipcRenderer.invoke("get-game-details", gameId), // Expose getGameDetails
  syncTokens: (idToken, accessToken, refreshToken) =>
    ipcRenderer.invoke("sync-tokens", { idToken, accessToken, refreshToken }),
  sendOAuthStart: () => ipcRenderer.invoke("oauth-start"),
  sendAuthCode: (authCode) => ipcRenderer.invoke("auth-code", authCode), // Send auth code to main process
  onOAuthSuccess: (callback) => ipcRenderer.invoke("oauth-success", callback),
  onOAuthError: (callback) => ipcRenderer.invoke("oauth-error", callback),
  handleStatusLoLClient: (callback) =>
    ipcRenderer.on("status-lol-client", (_events, value) => {
      callback(value);
    }),
});

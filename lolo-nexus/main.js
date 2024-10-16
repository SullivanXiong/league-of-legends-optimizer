require("dotenv").config(); // Load environment variables from .env file
const path = require("path");
const express = require("express");
const { app, BrowserWindow, ipcMain } = require("electron");
const { OAuth2Client } = require("google-auth-library");
const { oAuthStart } = require("./electron-main/ipc-main/oauth");
const { synctokens } = require("./electron-main/ipc-main/sync-tokens");
const { syncCacheWithServer } = require("./electron-main/utils/match-history-cache");
const { startPollingMatchHistory } = require("./electron-main/utils/poll");

// Path to the cache file (can be stored in app's data directory)
const PORT = process.env.ELECTRON_PORT || 7000;
const serverApp = express();

// Serve the Electron app's index.html over HTTP
serverApp.use(express.static(path.join(__dirname)));

serverApp.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID, // Load from environment variable
  process.env.GOOGLE_CLIENT_SECRET, // Load from environment variable
  "urn:ietf:wg:oauth:2.0:oob" // Redirect URI for desktop apps
);

function createWindow() {
  let win = new BrowserWindow({
    width: 410,
    height: 150,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    autoHideMenuBar: true,
    frame: true,
  });

  win.loadURL(`http://localhost:${PORT}/index.html`);

  win.on("closed", function () {
    win = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // TODO: create a variable called credentials and poll to check if the app is running, if it is get the port and token and do the following below
  syncCacheWithServer(); // Sync cache with server when the app is ready
  startPollingMatchHistory(); // Start polling when the app is ready
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle fetching specific game details based on gameId
ipcMain.handle("get-game-details", async (event, gameId) => {
  getGameDetails(event, gameId);
});

// Handle the IPC event from the renderer process
ipcMain.on("sync-tokens", async (event, { idToken, accessToken, refreshToken }) => {
  synctokens(event, { idToken, accessToken, refreshToken });
});

// Handle OAuth start triggered from the renderer process
ipcMain.on("oauth-start", async (event) => {
  oAuthStart(event, client);
});

// Handle the authorization code submission from the renderer process
ipcMain.on("oauth-code", async (event, authCode) => {
  oAuthCode(event, authCode);
});

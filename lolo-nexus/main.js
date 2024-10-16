require("dotenv").config(); // Load environment variables from .env file
const path = require("path");
const express = require("express");
const { app, BrowserWindow, ipcMain } = require("electron");
const { OAuth2Client } = require("google-auth-library");
const { oAuthStart } = require("./electron-main/ipc-main/oauth");
const { synctokens } = require("./electron-main/ipc-main/sync-tokens");
const { syncCacheWithServer } = require("./electron-main/utils/match-history-cache");
const { startPollingMatchHistory } = require("./electron-main/utils/poll");
const { isLeagueClientRunning, getPortAndToken } = require("./electron-main/utils/get-port-and-token");

// Path to the cache file (can be stored in app's data directory)
const PORT = process.env.ELECTRON_PORT || 7000;
// Polling interval (e.g., 10 seconds)
const POLL_INTERVAL = 10000;
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
    width: process.env.ENV == "DEV" ? 1920 : 410,
    height: process.env.ENV == "DEV" ? 1080 : 150,
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

  if (process.env.ENV == "DEV") {
    // Open the DevTools.
    win.webContents.openDevTools();
  }

  return win;
}

app.whenReady().then(() => {
  const win = createWindow();

  // Track whether the League client is running
  let isClientRunning = false;
  let credentials = null;

  async function startPolling() {
    const running = await isLeagueClientRunning();

    if (!running) {
      console.log("League client is not running");
      isClientRunning = false;
      credentials = null; // Clear credentials when the client is closed
      win.webContents.send("status-lol-client", 0);
    } else if (!isClientRunning) {
      console.log("League client detected. Fetching new port and token...");
      credentials = await getPortAndToken(); // Fetch new port and token
      isClientRunning = true;
      win.webContents.send("status-lol-client", 1);

      // Resume actions now that we have valid credentials
      syncCacheWithServer(credentials);
      startPollingMatchHistory(credentials);
    }
  }

  // poll to ensure the league of legends client is running.
  startPolling();
  setInterval(async () => {
    startPolling();
  }, POLL_INTERVAL);
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
ipcMain.handle("sync-tokens", async (event, { idToken, accessToken, refreshToken }) => {
  synctokens(event, { idToken, accessToken, refreshToken });
});

// Handle OAuth start triggered from the renderer process
ipcMain.handle("oauth-start", async (event) => {
  oAuthStart(event, client);
});

// Handle the authorization code submission from the renderer process
ipcMain.handle("oauth-code", async (event, authCode) => {
  oAuthCode(event, authCode);
});

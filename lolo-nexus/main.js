require("dotenv").config(); // Load environment variables from .env file
const path = require("path");
const express = require("express");
const { app, BrowserWindow, ipcMain } = require("electron");
const { oAuthStart, oAuthCode } = require("./electron-main/ipc-main/oauth");
const { synctokens } = require("./electron-main/ipc-main/sync-tokens");
const { syncCacheWithServer } = require("./electron-main/utils/match-history-cache");
const { startPollingMatchHistory } = require("./electron-main/utils/poll");
const { isLeagueClientRunning, getPortAndToken } = require("./electron-main/utils/get-port-and-token");

// TODO: Move constants to a util file.
// Path to the cache file (can be stored in app's data directory)
const PORT = process.env.ELECTRON_PORT || 7000;
const LOCALHOST_URL = `http://localhost:${PORT}`;
// Polling interval (e.g., 10 seconds)
const POLL_INTERVAL = 10000;
const serverApp = express();

// Serve the Electron app's index.html over HTTP
serverApp.use(express.static(path.join(__dirname)));

// Handle OAuth callback
serverApp.get("/callback", (req, res) => {
  const authCode = req.query.code; // Extract the authorization code from the query params

  // Send the authorization code back to the main process
  oAuthCode(authCode);

  // Serve a response that contains JavaScript to auto-close the window
  res.send(`
    <html>
      <body>
        <h1></h1>
        <p>You can close this window, or it will automatically close in a few seconds.</p>
        <script>
          setTimeout(function() {
            window.close();  // Automatically close the browser window after a delay
          }, 1000);  // Delay of 1 second to allow the user to see the success message
        </script>
      </body>
    </html>
  `);
});

serverApp.listen(PORT, () => {
  console.log(`Server running on ${LOCALHOST_URL}`);
});

function createWindow() {
  let win = new BrowserWindow({
    width: process.env.ENV == "DEV+TOOLS" ? 1920 : 410,
    height: process.env.ENV == "DEV+TOOLS" ? 1080 : 150,
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

  if (process.env.ENV == "DEV+TOOLS") {
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
      win.webContents.send("status-lol-client", 0); // Disconnected status
    } else if (!isClientRunning) {
      console.log("League client detected. Fetching new port and token...");
      credentials = await getPortAndToken(); // Fetch new port and token
      isClientRunning = true;
      win.webContents.send("status-lol-client", 1); // Connected status

      // start actions now that we have valid credentials
      win.webContents.send("status-etl", 2); // In-progress status
      syncCacheWithServer(credentials).then(() => {
        win.webContents.send("status-etl", 1); // Connected status
      });
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
  oAuthStart(event);
});

// Handle the authorization code submission from the renderer process
ipcMain.handle("oauth-code", async (event, authCode) => {
  oAuthCode(event, authCode);
});

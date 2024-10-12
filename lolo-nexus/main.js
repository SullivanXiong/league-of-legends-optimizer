require("dotenv").config(); // Load environment variables from .env file
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const express = require("express");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { syncTokensToServer } = require("./OAuth/serverSync");
const { OAuth2Client } = require("google-auth-library");

// Path to the cache file (can be stored in app's data directory)
const cacheFilePath = path.join(__dirname, "match-history-cache.json");

const serverApp = express();
const PORT = process.env.ETL_PORT || 7000;

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

// Save match history to a local file
function saveMatchHistoryToFile(matchHistory) {
  fs.writeFile(cacheFilePath, JSON.stringify(matchHistory, null, 2), (err) => {
    if (err) {
      console.error("Error writing match history to file:", err);
    } else {
      console.log("Match history successfully cached to file");
    }
  });
}

function loadMatchHistoryFromFile() {
  if (fs.existsSync(cacheFilePath)) {
    try {
      const data = fs.readFileSync(cacheFilePath);
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading match history from file:", err);
      return { games: { games: [] } }; // Initialize with an empty match history
    }
  } else {
    // If no cache file exists, initialize with an empty structure
    return { games: { games: [] } };
  }
}

// Function to sync cached match history with server
async function syncCacheWithServer() {
  try {
    // Fetch all matches stored on the server
    const serverMatches = await fetchServerMatches();
    const cachedMatches = loadMatchHistoryFromFile();

    // Get server game IDs
    const serverGameIds = serverMatches.map((match) => match.gameId);

    // Check for any matches in the cache that the server doesn't have
    const missingMatches = cachedMatches.games.games.filter((cachedGame) => !serverGameIds.includes(cachedGame.gameId));

    // Resend any missing matches to the server
    for (const match of missingMatches) {
      const gameDetails = await fetchGameDetails(match.gameId); // Fetch detailed game data

      // Check if the game is not a practice tool game before submitting
      if (isValidGameType(gameDetails)) {
        await submitGameToServer(gameDetails);
      } else {
        console.log(`Skipped PRACTICETOOL game with ID: ${match.gameId}`); // Fixed logging
      }
    }
  } catch (error) {
    console.error("Error syncing cache with server:", error);
  }
}

// Fetch all matches from the server
async function fetchServerMatches() {
  try {
    const response = await axios.get("http://localhost:3000/api/matches");
    return response.data;
  } catch (error) {
    console.error("Error fetching matches from server:", error);
    return [];
  }
}

let lastMatchHistory = loadMatchHistoryFromFile(); // Load cached match history

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 159,
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

  win32.on("closed", function () {
    win32 = null;
  });
}

app.whenReady().then(() => {
  createWindow();
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
  try {
    const gameDetails = await fetchGameDetails(gameId);
    return gameDetails; // Send game details back to renderer process
  } catch (error) {
    console.error(`Main process: Error fetching game details for gameId ${gameId}`, error);
    return { error: "Unable to fetch game details" };
  }
});

// Handle the IPC event from the renderer process
ipcMain.on("sync-tokens", async (event, { idToken, accessToken, refreshToken }) => {
  try {
    await syncTokensToServer(idToken, accessToken, refreshToken);
    console.log("Tokens synced successfully.");
  } catch (error) {
    console.error("Failed to sync tokens:", error);
  }
});

// Handle OAuth start triggered from the renderer process
ipcMain.on("oauth-start", async (event) => {
  try {
    // Generate the Google OAuth URL
    const authUrl = client.generateAuthUrl({
      access_type: "offline", // Request refresh token
      scope: ["https://www.googleapis.com/auth/userinfo.profile"], // The scopes you want
    });

    // Open the Google OAuth URL in the user's default browser
    shell.openExternal(authUrl);

    // Inform the user to enter the code in the UI (handled in renderer process)
    // No oauth-success sent here; it will be sent after tokens are retrieved.
  } catch (error) {
    console.error("Error during OAuth flow:", error);
    event.sender.send("oauth-error", error);
  }
});

// Handle the authorization code submission from the renderer process
ipcMain.on("auth-code", async (event, authCode) => {
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken(authCode);
    client.setCredentials(tokens); // Set the credentials (access and refresh tokens)

    // Send the tokens back to the renderer process
    event.sender.send("oauth-success", tokens);
  } catch (error) {
    console.error("Error during token exchange:", error);
    event.sender.send("oauth-error", error);
  }
});

// Filter out PRACTICETOOL games
function isValidGameType(gameData) {
  return gameData.gameType !== "PRACTICETOOL"; // Ignore PRACTICETOOL games
}

function startPollingMatchHistory() {
  const pollingInterval = 10000; // Poll every 10 seconds (adjust if needed)

  setInterval(async () => {
    try {
      const matchHistory = await getLCUMatchHistory();
      if (hasMatchHistoryChanged(matchHistory)) {
        const newGames = getNewGameIds(matchHistory);

        for (const gameId of newGames) {
          const gameDetails = await fetchGameDetails(gameId);
          if (isValidGameType(gameDetails)) {
            await submitGameToServer(gameDetails);
          } else {
            console.log(`Skipped PRACTICETOOL game with ID: ${gameId}`);
          }
        }

        lastMatchHistory = matchHistory; // Update the stored match history
        saveMatchHistoryToFile(matchHistory); // Cache the new match history
      }
    } catch (error) {
      console.error("Error fetching match history or game details", error);
    }
  }, pollingInterval);
}

// Cache port and token locally so it doesn't have to be fetched every time
async function getPortAndToken() {
  const commandOutput = await runCommand("WMIC PROCESS WHERE \"name='LeagueClientUx.exe'\" GET commandline");

  const portMatch = commandOutput.match(/--app-port=(\d+)/);
  const tokenMatch = commandOutput.match(/--remoting-auth-token=([\w-]+)/);
  if (!portMatch || !tokenMatch) {
    console.error("Main process: Error - Could not extract port/token");
    throw new Error("Could not extract port or token");
  }

  const port = portMatch[1];
  const token = tokenMatch[1];
  return { port, token };
}

// Riot LCU API Integration
async function getLCUMatchHistory() {
  try {
    const { port, token } = await getPortAndToken();

    const riotUrl = `https://127.0.0.1:${port}/lol-match-history/v1/products/lol/current-summoner/matches`;

    const response = await axios.get(riotUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from("riot:" + token).toString("base64")}`,
        "Content-Type": "application/json",
      },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    });

    return response.data;
  } catch (error) {
    console.error("Main process: Error fetching data from Riot LCU", error);
    return { error: "Unable to fetch data" };
  }
}

// Function to fetch the game details from the LCU API
async function fetchGameDetails(gameId) {
  const { port, token } = await getPortAndToken();

  try {
    const response = await axios.get(`https://127.0.0.1:${port}/lol-match-history/v1/games/${gameId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from("riot:" + token).toString("base64")}`,
        "Content-Type": "application/json",
      },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }), // Ignore self-signed SSL
    });
    return response.data;
  } catch (error) {
    console.error("Main process: Error fetching game details", error);
    throw error;
  }
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const exec = require("child_process").exec;
    exec(command, (error, stdout) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });
}

// Check if match history has changed by comparing with previous data
function hasMatchHistoryChanged(newMatchHistory) {
  const newGamesArray = newMatchHistory.games?.games || []; // Handle missing or empty games array safely
  const lastGamesArray = lastMatchHistory.games?.games || [];

  // Compare game IDs to detect new matches
  return newGamesArray.some((game) => !lastGamesArray.find((lastGame) => lastGame.gameId === game.gameId));
}

// Extract new game IDs from the match history
function getNewGameIds(newMatchHistory) {
  const newGamesArray = newMatchHistory.games?.games || [];
  const lastGamesArray = lastMatchHistory.games?.games || [];

  return newGamesArray
    .filter((game) => !lastGamesArray.find((lastGame) => lastGame.gameId === game.gameId))
    .map((game) => game.gameId);
}

// Function to submit the game data to the server
async function submitGameToServer(gameDetails) {
  try {
    const response = await axios.post("http://localhost:3000/api/match", gameDetails);
  } catch (error) {
    console.error("Error uploading game data to server:", error);
  }
}

const fs = require("fs");
const { getMatchHistory, getMatchDetails } = require("./lcu");

// Save match history to a local file
function saveMatchHistoryToFile(cacheFilePath, matchHistory) {
  fs.writeFile(cacheFilePath, JSON.stringify(matchHistory, null, 2), (err) => {
    if (err) {
      console.error("Error writing match history to file:", err);
    } else {
      console.log("Match history successfully cached to file");
    }
  });
}

function loadMatchHistoryFromFile(cacheFilePath) {
  try {
    if (fs.existsSync(cacheFilePath)) {
      const data = fs.readFileSync(cacheFilePath);
      return JSON.stringify(data.toString());
    } else {
      // If no cache file exists, initialize with an empty structure
      return { games: { games: [] } };
    }
  } catch (err) {
    console.error("Error reading match history from file:", err);
    return { games: { games: [] } }; // Initialize with an empty match history
  }
}

// Function to sync cached match history with server
async function syncCacheWithServer() {
  try {
    // Fetch all matches stored on the server
    const serverMatches = await getMatchHistory();
    const cachedMatches = loadMatchHistoryFromFile();

    // Get server game IDs
    const serverGameIds = serverMatches.games.games.map((match) => match.gameId);

    // Check for any matches in the cache that the server doesn't have
    const missingMatches = cachedMatches.games.games.filter((cachedGame) => !serverGameIds.includes(cachedGame.gameId));

    // Resend any missing matches to the server
    for (const match of missingMatches) {
      const gameDetails = await getMatchDetails(match.gameId); // Fetch detailed game data

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

// Check if match history has changed by comparing with previous data
function hasMatchHistoryChanged(newMatchHistory, lastMatchHistory) {
  const newGamesArray = newMatchHistory.games?.games || []; // Handle missing or empty games array safely
  const lastGamesArray = lastMatchHistory.games?.games || [];

  // Compare game IDs to detect new matches
  return newGamesArray.some((game) => !lastGamesArray.find((lastGame) => lastGame.gameId === game.gameId));
}

// Extract new game IDs from the match history
function getNewGameIds(newMatchHistory, lastMatchHistory) {
  const newGamesArray = newMatchHistory.games?.games || [];
  const lastGamesArray = lastMatchHistory.games?.games || [];

  return newGamesArray
    .filter((game) => !lastGamesArray.find((lastGame) => lastGame.gameId === game.gameId))
    .map((game) => game.gameId);
}

module.exports = {
  saveMatchHistoryToFile,
  loadMatchHistoryFromFile,
  syncCacheWithServer,
  hasMatchHistoryChanged,
  getNewGameIds,
};

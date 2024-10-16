const {
  loadMatchHistoryFromFile,
  saveMatchHistoryToFile,
  hasMatchHistoryChanged,
  getNewGameIds,
} = require("./match-history-cache");
const { getMatchDetails, getMatchHistory } = require("./lcu");
const { isValidGameType } = require("./valid-game-type");
const { submitGameToServer } = require("../etl/etl");
const path = require("path");

const CACHE_FILE_PATH = path.join(__dirname, "../match-history-cache.json");
let lastMatchHistory = loadMatchHistoryFromFile(CACHE_FILE_PATH); // Load cached match history

function startPollingMatchHistory() {
  const pollingInterval = 10000; // Poll every 10 seconds (adjust if needed)

  setInterval(async () => {
    try {
      const matchHistory = await getMatchHistory();
      if (hasMatchHistoryChanged(matchHistory, lastMatchHistory)) {
        const newGames = getNewGameIds(matchHistory, lastMatchHistory);

        for (const gameId of newGames) {
          const gameDetails = await getMatchDetails(gameId);
          if (isValidGameType(gameDetails)) {
            await submitGameToServer(gameDetails);
          } else {
            console.log(`Skipped PRACTICETOOL game with ID: ${gameId}`);
          }
        }
      }
      lastMatchHistory = matchHistory; // Update the stored match history
      saveMatchHistoryToFile(CACHE_FILE_PATH, matchHistory); // Cache the new match history
    } catch (error) {
      console.error("Error fetching match history or game details", error);
    }
  }, pollingInterval);
}

module.exports = { startPollingMatchHistory };

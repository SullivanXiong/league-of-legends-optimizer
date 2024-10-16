// Filter out PRACTICETOOL games
function isValidGameType(gameData) {
  return gameData.gameType !== "PRACTICETOOL"; // Ignore PRACTICETOOL games
}

module.exports = { isValidGameType };

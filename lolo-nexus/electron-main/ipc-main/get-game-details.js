async function getGameDetails(event, gameId) {
  try {
    const gameDetails = await getMatchDetails(gameId);
    return gameDetails; // Send game details back to renderer process
  } catch (error) {
    console.error(`Main process: Error fetching game details for gameId ${gameId}`, error);
    return { error: "Unable to fetch game details" };
  }
}

module.exports = { getGameDetails };

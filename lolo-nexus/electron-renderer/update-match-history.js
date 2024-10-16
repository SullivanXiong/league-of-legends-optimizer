export function setupMatchHistoryResultHandlers() {
  window.electronAPI.onMatchHistoryUpdate((event, updatedMatchHistory) => {
    console.log("Match history updated:", updatedMatchHistory);
    updateMatchHistoryUI(updatedMatchHistory);
  });
}

export async function getMatchDetails(gameId) {
  try {
    const gameDetails = await window.electronAPI.getGameDetails(gameId);
    console.log("Game details:", gameDetails);

    // Update UI with game details
    const gameDetailsElement = document.getElementById("game-details-data");
    gameDetailsElement.textContent = JSON.stringify(gameDetails, null, 2);
  } catch (error) {
    console.error("Error fetching game details:", error);
    document.getElementById("game-details-data").textContent = "Error fetching game details.";
  }
}

function updateMatchHistoryUI(updatedMatchHistory) {
  const matchHistoryElement = document.getElementById("riot-data");
  matchHistoryElement.innerHTML = ""; // Clear previous content

  updatedMatchHistory.games.games.forEach((match) => {
    const gameId = match.gameId;
    const gameDate = new Date(match.gameCreation).toLocaleString();
    const gameMode = match.gameMode;
    const winStatus = match.teams.find((t) => t.teamId === 200).win ? "Win" : "Loss";

    const matchElement = document.createElement("div");
    matchElement.innerHTML = `
            <strong>Game ID: <span class="game-id">${gameId}</span></strong><br/>
            Date: ${gameDate}<br/>
            Mode: ${gameMode}<br/>
            Result: ${winStatus}<br/><br/>
        `;

    matchElement.querySelector(".game-id").addEventListener("click", () => {
      getMatchDetails(gameId); // Fetch and display game details for the clicked game ID
    });

    matchHistoryElement.appendChild(matchElement);
  });
}

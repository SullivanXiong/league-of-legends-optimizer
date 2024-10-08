// Handle manual game ID search
document
  .getElementById("searchGameButton")
  .addEventListener("click", async () => {
    const gameId = document.getElementById("gameIdInput").value.trim();
    if (gameId) {
      await fetchGameDetails(gameId);
    } else {
      alert("Please enter a valid game ID.");
    }
  });

document.getElementById("sign-in-btn").addEventListener("click", () => {
  // Request the main process to initiate the OAuth flow
  window.electronAPI.sendOAuthStart();

  // Show the authorization code input box when the OAuth flow starts
  document.getElementById("auth-code-container").style.display = "block";
});

// When the user submits the authorization code
document.getElementById("submit-code-btn").addEventListener("click", () => {
  const authCode = document.getElementById("auth-code-input").value;
  window.electronAPI.sendAuthCode(authCode); // Send the auth code to the main process

  // Show the authorization code input box when the OAuth flow starts
  document.getElementById("auth-code-container").style.display = "none";
});

// Listen for OAuth result (authorization code, tokens, or error)
window.electronAPI.onOAuthSuccess((event, tokens) => {
  console.log("OAuth Success:", tokens);
  idToken = tokens.id_token;
  accessToken = tokens.access_token;
  refreshToken = tokens.refresh_token;
  window.electronAPI.syncTokens(idToken, accessToken, refreshToken);
  // You now have access and refresh tokens in the renderer process
});

window.electronAPI.onOAuthError((event, error) => {
  console.error("OAuth Error:", error);
});

// Listen for match history updates from the main process
window.electronAPI.onMatchHistoryUpdate((event, updatedMatchHistory) => {
  console.log("Renderer process: Match history updated", updatedMatchHistory);

  const matchHistoryElement = document.getElementById("riot-data");

  matchHistoryElement.innerHTML = ""; // Clear previous content

  updatedMatchHistory.games.games.forEach((match) => {
    const gameId = match.gameId;
    const gameDate = new Date(match.gameCreation).toLocaleString();
    const gameMode = match.gameMode;
    const winStatus = match.teams.find((t) => t.teamId === 200).win
      ? "Win"
      : "Loss"; // Assuming teamId 200 is the user's team

    // Create a human-readable format
    const matchElement = document.createElement("div");
    matchElement.innerHTML = `
            <strong>Game ID: <span class="game-id">${gameId}</span></strong><br/>
            Date: ${gameDate}<br/>
            Mode: ${gameMode}<br/>
            Result: ${winStatus}<br/><br/>
        `;

    // Make game ID clickable
    matchElement.querySelector(".game-id").addEventListener("click", () => {
      fetchGameDetails(gameId); // Fetch and display game details for the clicked game ID
    });

    matchHistoryElement.appendChild(matchElement);
  });

  // Update the UI with the new match history data
  const riotDataElement = document.getElementById("riot-data");
  riotDataElement.textContent = JSON.stringify(updatedMatchHistory, null, 2);
});

// Fetch game details based on gameId
async function fetchGameDetails(gameId) {
  console.log(`Fetching game details for Game ID: ${gameId}`);

  try {
    const gameDetails = await window.electronAPI.getGameDetails(gameId);
    console.log("Game details:", gameDetails);

    const gameDetailsElement = document.getElementById("game-details-data");
    gameDetailsElement.textContent = JSON.stringify(gameDetails, null, 2); // Display raw JSON for now
  } catch (error) {
    console.error("Error fetching game details:", error);
    document.getElementById("game-details-data").textContent =
      "Error fetching game details.";
  }
}

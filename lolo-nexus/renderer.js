export async function setupOAuthListeners() {
  // OAuth Start
  document.getElementById("google-btn").addEventListener("click", () => {
    window.electronAPI.sendOAuthStart();
    // Show the authorization code input box
    document.getElementById("auth-code-container").style.display = "block";
  });

  //   // Handle OAuth Code submission
  //   document.getElementById("submit-code-btn").addEventListener("click", () => {
  //     const authCode = document.getElementById("auth-code-input").value;
  //     window.electronAPI.sendAuthCode(authCode);
  //     document.getElementById("auth-code-container").style.display = "none";
  //   });
}

export async function setupOAuthResultHandlers() {
  // Handle OAuth Success
  window.electronAPI.onOAuthSuccess((event, tokens) => {
    console.log("OAuth Success:", tokens);
    window.electronAPI.syncTokens(tokens.id_token, tokens.access_token, tokens.refresh_token);
  });

  // Handle OAuth Error
  window.electronAPI.onOAuthError((event, error) => {
    console.error("OAuth Error:", error);
  });
}

function getStatusDot(element) {
  for (const child of element.children) {
    if (child.className.includes("status-dot")) {
      return child;
    }
  }
}

function toggleStatus(statusDotElement) {
  if (statusDotElement.className.includes("disconnected")) {
    let newClassName = statusDotElement.className.split(" ").filter((status) => status != "disconnected");

    newClassName.push("connected");
    statusDotElement.className = newClassName.join(" ");
  } else if (statusDotElement.className.includes("connected")) {
    let newClassName = statusDotElement.className.split(" ").filter((status) => status != "connected");

    newClassName.push("disconnected");
    statusDotElement.className = newClassName.join(" ");
  }
}

export async function setupStatusResultHandlers() {
  // Handle LoL Client Status
  window.electronAPI.handleStatusLoLClient((status_code) => {
    let lolClientElement = document.getElementsByClassName("lol-client")[0];
    let statusDot = getStatusDot(lolClientElement);
    let statusDotClassNames = statusDot.className.split(" ");

    if (
      (status_code === 1 && statusDotClassNames.includes("disconnected")) ||
      (status_code === 0 && statusDotClassNames.includes("connected"))
    ) {
      toggleStatus(statusDot);
    }
  });
}

export async function setupMatchHistoryResultHandlers() {
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

// Initialize listeners
document.addEventListener("DOMContentLoaded", async () => {
  setupStatusResultHandlers(); // Status
  setupOAuthListeners(); // OAuth logic
  setupOAuthResultHandlers(); // Handle OAuth events
  setupMatchHistoryResultHandlers(); // Match history updates
});

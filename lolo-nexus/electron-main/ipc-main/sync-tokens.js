const fetch = require("node-fetch"); // Use node-fetch for making HTTP requests

const syncTokensToServer = async (idToken, accessToken, refreshToken) => {
  try {
    const response = await fetch("http://localhost:3000/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
        accessToken,
        refreshToken,
      }),
    });

    const data = await response.json();
    console.log("Server response:", data);
    return data;
  } catch (error) {
    console.error("Error syncing tokens to server:", error);
    throw error;
  }
};

export async function synctokens(
  event,
  { idToken, accessToken, refreshToken }
) {
  try {
    await syncTokensToServer(idToken, accessToken, refreshToken);
    console.log("Tokens synced successfully.");
  } catch (error) {
    console.error("Failed to sync tokens:", error);
  }
}

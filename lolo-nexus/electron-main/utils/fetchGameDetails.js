import { getPortAndToken } from "./getPortAndToken";

// Function to fetch the game details from the LCU API
export async function fetchGameDetails(gameId) {
  const { port, token } = await getPortAndToken();

  try {
    const response = await axios.get(
      `https://127.0.0.1:${port}/lol-match-history/v1/games/${gameId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from("riot:" + token).toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }), // Ignore self-signed SSL
      }
    );
    return response.data;
  } catch (error) {
    console.error("Main process: Error fetching game details", error);
    throw error;
  }
}

const { default: axios } = require("axios");
const { getPortAndToken } = require("./get-port-and-token");

// Riot LCU API Integration
async function getMatchHistory(credentials = undefined) {
  try {
    let { port, token } = credentials ? credentials : await getPortAndToken();

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
async function getMatchDetails(gameId, credentials = undefined) {
  let { port, token } = credentials ? credentials : await getPortAndToken();

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

module.exports = {
  getMatchHistory,
  getMatchDetails,
};

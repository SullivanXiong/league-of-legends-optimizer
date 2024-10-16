const { default: axios } = require("axios");
require("dotenv").config;

const ETL_PORT = process.env.ETL_PORT;

// Function to submit the game data to the server
async function submitGameToServer(gameDetails) {
  try {
    const response = await axios.post(`http://localhost:${ETL_PORT}/api/match`, gameDetails);
  } catch (error) {
    console.error("Error uploading game data to server:", error);
  }
}

module.exports = { submitGameToServer };

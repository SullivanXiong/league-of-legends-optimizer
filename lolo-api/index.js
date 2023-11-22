const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

const { Pool } = require("pg");

const pool = new Pool({
  user: "lolo_api",
  host: "localhost",
  database: "league_of_legends_optimizer",
  password: "lolo_api",
  port: 5432,
});

async function getSummonerId(inGameName, tagId) {
  options = {
    method: "GET",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
  };

  return await fetch(
    `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${inGameName}/${tagId}`,
    options
  )
    .then((res) => res.json())
    .then((data) => data);
}

async function getSummonerData(puuid) {
  options = {
    method: "GET",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
  };

  return await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, options)
    .then((res) => res.json())
    .then((data) => data);
}

async function getActiveInGameInfo(summonerId) {
  options = {
    method: "GET",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
  };

  return await fetch(`https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}`, options)
    .then((res) => res.json())
    .then((data) => data);
}

async function getMatchData(matchId) {
  options = {
    method: "GET",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
  };

  return await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/NA1_${matchId}`, options)
    .then((res) => res.json())
    .then((data) => data);
}

app.get("/matchData", async (req, res) => {
  const matchId = req.query.matchId;

  const matchData = await getMatchData(matchId);
  console.log(matchData);
  res.send(matchData);
});

app.get("/activeGameData", async (req, res) => {
  const inGameName = req.query.inGameName;
  const tagId = req.query.tagId;

  const summoner = await getSummonerId(inGameName, tagId);
  const summonerData = await getSummonerData(summoner.puuid);
  const inGameInfo = await getActiveInGameInfo(summonerData.id);
  console.log(inGameInfo);

  res.send(inGameInfo);
});

// Example query
app.get("/data", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM your_table");
    res.json(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

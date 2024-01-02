const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
const draftimizerMetaDataRoutes = require("./draftimizer/metaData");
app.use("/draftimizer/meta", draftimizerMetaDataRoutes);

const { Pool } = require("pg");

const pool = new Pool({
  user: "lolo_api",
  host: "localhost",
  database: "league_of_legends_optimizer",
  password: "lolo_api",
  port: 5432,
});

const {
  getSummonerId,
  getSummonerData,
  getActiveInGameInfo,
  getPlayerMatches,
  getMatchData,
  createTournamentProvider,
  createTournament,
  createTournamentCode,
  getTournamentData,
} = require("./riotApi");

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
  const playerMatches = await getPlayerMatches(summonerData.puuid);
  console.log(playerMatches);
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

app.get("/tournamentProviderId", async (req, res) => {
  const tournamentProviderId = await createTournamentProvider();
  console.log(tournamentProviderId);
  res.send({ tournamentProviderId: tournamentProviderId });
});

app.get("/tournamentId", async (req, res) => {
  const tournamentId = await createTournament();
  console.log(tournamentId);
  res.send({ tournamentId: tournamentId });
});

app.get("/tournamentCode", async (req, res) => {
  const tournamentCode = await createTournamentCode(3, 2);
  console.log(tournamentCode);
  res.send({ tournamentCode: tournamentCode });
});

app.get("/tournamentData", async (req, res) => {
  const tournamentCode = req.query.tournamentCode;

  const tournamentData = await getTournamentData(tournamentCode);
  console.log(tournamentData);
  res.send({ tournamentData: tournamentData });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

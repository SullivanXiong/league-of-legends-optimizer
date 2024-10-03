const express = require("express");
const db = require("./db"); // Assuming you export the db connection
const app = express();
app.use(express.json());

function wereDragonsUseful(matchData) {
  const team100 = matchData.teams.find((team) => team.teamId === 100);
  const team200 = matchData.teams.find((team) => team.teamId === 200);

  const dragonKills100 = team100 ? team100.dragonKills : 0;
  const dragonKills200 = team200 ? team200.dragonKills : 0;

  const winningTeam = matchData.teams.find((team) => team.win === "Win");

  if (winningTeam && winningTeam.teamId === 100) {
    return dragonKills100 > dragonKills200 ? "Dragons were useful" : "Dragons were not as useful";
  } else if (winningTeam && winningTeam.teamId === 200) {
    return dragonKills200 > dragonKills100 ? "Dragons were useful" : "Dragons were not as useful";
  } else {
    return "Could not determine dragon usefulness";
  }
}

function calculateGoldLeads(matchData) {
  let goldTeam100 = 0;
  let goldTeam200 = 0;

  matchData.participants.forEach((participant) => {
    if (participant.teamId === 100) {
      goldTeam100 += participant.stats.goldEarned;
    } else if (participant.teamId === 200) {
      goldTeam200 += participant.stats.goldEarned;
    }
  });

  const winningTeam = matchData.teams.find((team) => team.win === "Win");

  return {
    goldTeam100,
    goldTeam200,
    goldLeadImpact:
      winningTeam && winningTeam.teamId === 100
        ? goldTeam100 > goldTeam200
          ? "Gold lead impacted win"
          : "Gold lead did not impact win"
        : winningTeam && winningTeam.teamId === 200
        ? goldTeam200 > goldTeam100
          ? "Gold lead impacted win"
          : "Gold lead did not impact win"
        : "Could not determine impact of gold lead",
  };
}

function comparePlayersByOpponents(matchData) {
  const roleComparison = {};

  // Create a map to link participants with summoner names using participantIdentities
  const participantIdentityMap = {};
  matchData.participantIdentities.forEach((identity) => {
    participantIdentityMap[identity.participantId] = identity.player.summonerName;
  });

  // TODO: fix this so that it's actually comparing players by their true role
  // Iterate through the players and compare their performance
  for (let i = 0; i < 5; i++) {
    const team100Player = matchData.participants[i];
    const team200Player = matchData.participants[i + 5];

    // Map participantId to summoner name
    const team100SummonerName = participantIdentityMap[team100Player.participantId];
    const team200SummonerName = participantIdentityMap[team200Player.participantId];

    // Add debugging logs to inspect the player data
    console.log(`Comparing Player ${i + 1}`);
    console.log("Team 100 Player Summoner Name:", team100SummonerName);
    console.log("Team 200 Player Summoner Name:", team200SummonerName);

    if (team100Player && team200Player) {
      const betterPlayer = comparePlayers(team100Player, team200Player);

      if (betterPlayer === "Team 100 player") {
        roleComparison[`Matchup ${i + 1}`] = {
          "Team 100 player": team100SummonerName,
          "Team 200 player": team200SummonerName,
          Winner: `Team 100 player: ${team100SummonerName}`,
        };
      } else if (betterPlayer === "Team 200 player") {
        roleComparison[`Matchup ${i + 1}`] = {
          "Team 100 player": team100SummonerName,
          "Team 200 player": team200SummonerName,
          Winner: `Team 200 player: ${team200SummonerName}`,
        };
      }
    } else {
      console.warn(`Could not find players for matchup ${i + 1}`);
    }
  }

  console.log("Final roleComparison:", roleComparison);
  return roleComparison;
}

// Compare players based on stats (you can adjust the scoring logic)
function comparePlayers(player1, player2) {
  const player1Score = calculatePlayerScore(player1);
  const player2Score = calculatePlayerScore(player2);
  return player1Score > player2Score ? "Team 100 player" : "Team 200 player";
}

function calculatePlayerScore(player) {
  const { kills, assists, deaths, damageDealtToChampions } = player.stats;
  return kills + assists - deaths + damageDealtToChampions / 1000;
}

// API route to fetch all matches
app.get("/api/matches", (req, res) => {
  const sql = `SELECT * FROM matches`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching matches from database:", err.message);
      return res.status(500).send("Error fetching matches");
    }

    res.json(rows);
  });
});

// API route to handle match uploads with ETL (Extract, Transform, Load)
app.post("/api/match", (req, res) => {
  const matchData = req.body;
  const gameId = matchData.gameId;

  // Check if the game is from Practice Tool
  if (matchData.gameMode === "PRACTICETOOL") {
    console.log(`Ignoring PRACTICETOOL game with ID: ${gameId}`);
    return res.status(400).send("Practice Tool games are not accepted");
  }

  // Check if the game ID already exists in the database
  const checkQuery = `SELECT gameId FROM matches WHERE gameId = ?`;
  db.get(checkQuery, [gameId], (err, row) => {
    if (err) {
      console.error("Error querying database:", err.message);
      return res.status(500).send("Server error");
    }

    if (row) {
      return res.status(400).send("Game already exists");
    }

    // Perform ETL - Transform data
    const goldLead = calculateGoldLeads(matchData);
    const dragonUsefulness = wereDragonsUseful(matchData);
    const roleComparison = comparePlayersByOpponents(matchData);

    const insertQuery = `
            INSERT INTO matches (gameId, gameDuration, dragonUsefulness, goldLead, roleComparison)
            VALUES (?, ?, ?, ?, ?)
        `;
    const values = [
      matchData.gameId,
      matchData.gameDuration,
      dragonUsefulness,
      JSON.stringify(goldLead),
      JSON.stringify(roleComparison),
    ];

    db.run(insertQuery, values, function (err) {
      if (err) {
        console.error("Error inserting data into database:", err.message);
        return res.status(500).send("Error inserting data");
      }
      console.log(`Inserted new game data with Game ID ${gameId}`);
      res.send("Game data inserted successfully");
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

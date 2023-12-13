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

async function getPlayerMatches(summonerId) {
  options = {
    method: "GET",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
  };

  return await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerId}/ids`, options)
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

async function createTournamentProvider() {
  options = {
    method: "POST",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
    body: JSON.stringify({ region: "NA", url: "http://localhost:5173/" }),
  };

  return await fetch(`https://americas.api.riotgames.com/lol/tournament-stub/v5/providers`, options)
    .then((res) => res.json())
    .then((data) => data);
}

async function createTournament(name = "Scrim") {
  options = {
    method: "POST",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
    body: JSON.stringify({ name: "Scrim - CG", providerId: 1 }),
  };

  return await fetch(`https://americas.api.riotgames.com/lol/tournament-stub/v5/tournaments`, options)
    .then((res) => res.json())
    .then((data) => data);
}

async function createTournamentCode(count, tournamentId) {
  options = {
    method: "POST",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
    body: JSON.stringify({
      enoughPlayers: true,
      mapType: "SUMMONERS_RIFT",
      metadata: "",
      pickType: "TOURNAMENT_DRAFT",
      spectatorType: "ALL",
      teamSize: 5,
    }),
  };

  return await fetch(
    `https://americas.api.riotgames.com/lol/tournament-stub/v5/codes?count=${count}&tournamentId=${tournamentId}`,
    options
  )
    .then((res) => res.json())
    .then((data) => data);
}

async function getTournamentData(tournamentCode) {
  options = {
    method: "GET",
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY,
    },
  };

  return await fetch(
    `https://americas.api.riotgames.com/lol/tournament-stub/v5/games/by-code/${tournamentCode}`,
    options
  )
    .then((res) => res.json())
    .then((data) => data);
}

module.exports = {
  getSummonerId,
  getSummonerData,
  getActiveInGameInfo,
  getPlayerMatches,
  getMatchData,
  createTournamentProvider,
  createTournament,
  createTournamentCode,
  getTournamentData,
};

const express = require("express");
const router = express.Router();

router.get("/versions", async (req, res) => {
  let options = {
    method: "GET",
  };

  let data = await (await fetch("https://ddragon.leagueoflegends.com/api/versions.json", options)).json();

  res.send(data);
});

router.get("/latestVersion", async (req, res) => {
  let options = {
    method: "GET",
  };

  let data = await (await fetch("https://ddragon.leagueoflegends.com/api/versions.json", options)).json();

  res.send(data[0]);
});

router.get("/champions", async (req, res) => {
  let options = {
    method: "GET",
  };

  let champions = await (
    await fetch("https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json", options)
  ).json();

  res.send(Object.keys(champions["data"]));
});

// "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png";

module.exports = router;

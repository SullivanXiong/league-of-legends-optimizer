const express = require("express");
const cors = require("cors");

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

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define a persistent file path for the database
const db = new sqlite3.Database(
  path.join(__dirname, "match-data.db"),
  (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to the persistent SQLite database");
    }
  }
);

// Create a table for storing match data
db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS matches (
            gameId INTEGER PRIMARY KEY,
            gameDuration INTEGER,
            dragonUsefulness TEXT,
            goldLead TEXT,
            roleComparison TEXT
        )
    `);
});

module.exports = db;

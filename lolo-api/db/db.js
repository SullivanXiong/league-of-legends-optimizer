const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define a persistent file path for the database
const db = new sqlite3.Database(path.join(__dirname, "lolo_db.db"), (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the persistent SQLite database");
  }
});

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

  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      uuid TEXT PRIMARY KEY,
      riot_id TEXT NOT NULL,
      riot_name TEXT NOT NULL,
      google_id TEXT UNIQUE,
      google_email TEXT UNIQUE,
      google_display_name TEXT
    )
  `);
});

module.exports = db;

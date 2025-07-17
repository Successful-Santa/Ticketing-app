const sqlite3 = require("sqlite3").verbose();

const GenerateRandomToken = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let token = "";
  for (let j = 0; j < length; j++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
};

// Connect to SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

module.exports = { db, GenerateRandomToken };

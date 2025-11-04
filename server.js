const express = require("express");
const { sqlPool } = require("./config/database");
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  // SQL Example
  const result = await sqlPool.query("SELECT * FROM Teams");
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// to get to server use "localhost:3000"

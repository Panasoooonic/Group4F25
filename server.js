const express = require("express");
const { sqlPool } = require("./config/database");
const userRoutes = require('./routes/userRoutes.js');
const app = express();
const port = 3000;

app.use(express.json());


app.use("/api", userRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// to get to server use "localhost:3000"

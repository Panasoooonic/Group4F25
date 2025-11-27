const express = require("express");
const userRoutes = require("./routes/userRoutes.js");
const tripRoutes = require("./routes/tripRoutes.js");
const tripSummaryRoutes = require("./routes/tripSummaryRoutes.js");
const vehicleRoutes = require("./routes/vehicleRoutes.js");
const app = express();
const cors = require("cors");
const port = 3000;

// Allow requests from http://localhost:8081
app.use(
  cors({
    origin: "http://localhost:8081",
  })
);

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/summary", tripSummaryRoutes);
app.use("/api/vehicle", vehicleRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// to get to server use "localhost:3000"

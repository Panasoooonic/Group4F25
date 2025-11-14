const express = require("express");
const { sqlPool } = require("./config/database");
const userRoutes = require('./routes/userRoutes.js');
const tripRoutes = require('./routes/tripRoutes.js');
const tripSummaryRoutes = require('./routes/tripSummaryRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const tripEventRoutes = require('./routes/tripEventRoutes.js');
const app = express();
const port = 3000;

app.use(express.json());


app.use("/api", userRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/summary", tripSummaryRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/events", tripEventRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// to get to server use "localhost:3000"

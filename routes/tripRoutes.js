const express = require('express');
const router = express.Router();
const { startTrip, endTrip, logTelemetry } = require('../controllers/tripController');
const { sqlPool } = require('../config/database');

//Test for /api/ user route


router.post('/start', startTrip);
router.post('/telemetry', logTelemetry);
router.post('/end', endTrip);
router.post("/start", startTrip);
router.post("/:tripId/point", addTripPoint);
router.get("/:tripId", getTripSummary);


module.exports = router;
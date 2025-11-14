const express = require('express');
const router = express.Router();
const { startTrip, endTrip, logTelemetry } = require('../controllers/tripController');
const { sqlPool } = require('../config/database');

//Test for /api/ user route

router.post('/start', startTrip);
router.post('/telemetry', logTelemetry);
router.post('/end', endTrip);


module.exports = router;
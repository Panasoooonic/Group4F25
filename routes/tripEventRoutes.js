const express = require('express');
const router = express.Router();
const { logEvent, getEventsByTrip, getEventsByUser } = require('../controllers/tripEventController');
const { sqlPool } = require('../config/database');

//Test for /api/ user route

router.post('log', logEvent);   // Considered not to use this
router.get('trip/:tripId', getEventsByTrip);
router.get('user/:userId', getEventsByUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/tripEventController');
const { sqlPool } = require('../config/database');

//Test for /api/ user route

router.post('/log', logEvent);
router.get('/events/:tripId', getEventsByTrip);
router.get('/trip/:userId', getEventsByUser);

module.exports = router;
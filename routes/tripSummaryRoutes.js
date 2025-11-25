const express = require('express');
const router = express.Router();
const { getSummariesByUser, getTripSummary } = require('../controllers/tripSummaryController');

//Test for /api/ user route

router.get('/:tripId', getTripSummary);
router.get('/user/:userId', getSummariesByUser);

module.exports = router;
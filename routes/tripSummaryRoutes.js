const express = require('express');
const router = express.Router();
const { getSummaryByTrip, getAllSummariesByUser} = require('../controllers/tripSummaryController');
const { sqlPool } = require('../config/database');

//Test for /api/ user route

router.get('/summary', getSummaryByTrip);
router.get('/summary/:user', getAllSummariesByUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const { startTrip, endTrip, addTripPoint, getTripSummary } = require('../controllers/tripController');

//Test for /api/ user route


router.post('/start', startTrip);
router.post("/:tripId/point", addTripPoint);
router.post("/:tripId/end", endTrip);
router.get("/:tripId", getTripSummary);


module.exports = router;
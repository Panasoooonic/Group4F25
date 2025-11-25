const { sqlPool } = require('../config/database');


// get events for a specific trip
const getTripSummary = async (req, res) => {
  try {
    const { tripId } = req.params;

    const [tripSummary] = await sqlPool.query(
      "SELECT * FROM Trip join TripSummary ON Trip.tripId = TripSummary.tripId WHERE Trip.tripId = ?",
      [tripId]
    );

    res.status(200).json({
      ...tripSummary[0],
    });

  } catch (error) {
    console.log("getEventsByTrip error:", error);
    res.status(500).json({ message: "Error fetching trip events" });
  }
};

// get all events for a user (JOIN needed)
const getSummariesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [tripSummary] = await sqlPool.query(
      "SELECT * FROM Trip join TripSummary ON Trip.tripId = TripSummary.tripId WHERE Trip.userId = ?",
      [userId]
    );

    res.status(200).json(tripSummary);

  } catch (error) {
    console.log("getEventsByUser error:", error);
    res.status(500).json({ message: "Error fetching user events" });
  }
};

module.exports = { getTripSummary, getSummariesByUser };
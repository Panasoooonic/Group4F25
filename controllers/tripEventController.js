const { sqlPool } = require('../config/database');

const logEvent = async (req, res) => {
  try {
    const { trip_id, user_id, event_type, event_data } = req.body;

    // basic validation
    if (!trip_id || !user_id || !event_type) {
      return res.status(400).json({ message: "trip_id, user_id and event_type are required" });
    }

    await sqlPool.query(
      "INSERT INTO trip_events (trip_id, user_id, event_type, event_data, created_at) VALUES (?, ?, ?, ?, NOW())",
      [trip_id, user_id, event_type, event_data || null]
    );

    res.status(201).json({ message: "Event logged successfully" });

  } catch (error) {
    console.log("logEvent error:", error);
    res.status(500).json({ message: "Error logging event" });
  }
};


// get events for a specific trip
const getEventsByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const [events] = await sqlPool.query(
      "SELECT * FROM trip_events WHERE trip_id = ? ORDER BY created_at ASC",
      [tripId]
    );

    res.status(200).json(events);

  } catch (error) {
    console.log("getEventsByTrip error:", error);
    res.status(500).json({ message: "Error fetching trip events" });
  }
};


// get all events for a user
const getEventsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [events] = await sqlPool.query(
      "SELECT * FROM trip_events WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json(events);

  } catch (error) {
    console.log("getEventsByUser error:", error);
    res.status(500).json({ message: "Error fetching user events" });
  }
};



module.exports = { logEvent, getEventsByTrip, getEventsByUser }
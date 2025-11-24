const { sqlPool } = require('../config/database');

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const startTrip = async (req, res) => {
  try {
    const { user_id } = req.body;

    const [result] = await sqlPool.query(
      "INSERT INTO trips (user_id, start_time) VALUES (?, NOW())",
      [user_id]
    );

    res.json({
      message: "Trip started",
      trip_id: result.insertId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const addTripPoint = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { latitude, longitude } = req.body;

    await sqlPool.query(
      "INSERT INTO trip_points (trip_id, latitude, longitude, recorded_at) VALUES (?, ?, ?, NOW())",
      [tripId, latitude, longitude]
    );

    res.json({ message: "Point saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};





const endTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const [points] = await sqlPool.query(
      "SELECT latitude, longitude FROM trip_points WHERE trip_id = ? ORDER BY recorded_at ASC",
      [tripId]
    );

    if (points.length < 2) {
      return res.status(400).json({
        error: "Not enough points to calculate distance",
      });
    }

    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += haversine(
        points[i].latitude,
        points[i].longitude,
        points[i + 1].latitude,
        points[i + 1].longitude
      );
    }

    await sqlPool.query(
      "UPDATE trips SET end_time = NOW(), total_distance_km = ? WHERE id = ?",
      [totalDistance, tripId]
    );

    res.json({
      message: "Trip ended",
      total_distance_km: totalDistance.toFixed(2),
      route_points: points,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getTripSummary = async (req, res) => {
  try {
    const { tripId } = req.params;

    const [[trip]] = await sqlPool.query(
      "SELECT * FROM trips WHERE id = ?",
      [tripId]
    );

    const [points] = await sqlPool.query(
      "SELECT latitude, longitude, recorded_at FROM trip_points WHERE trip_id = ?",
      [tripId]
    );

    res.json({
      ...trip,
      route: points,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { startTrip, addTripPoint, endTrip, getTripSummary };
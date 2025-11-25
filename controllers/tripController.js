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
    const { userId } = req.body;

    const [result] = await sqlPool.query(
      "INSERT INTO trip (userId, startTs) VALUES (?, NOW())",
      [userId]
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
      "INSERT INTO TelemetryPoint (tripId, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())",
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
      "SELECT latitude, longitude FROM TelemetryPoint WHERE tripId = ? ORDER BY timestamp ASC",
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
      "UPDATE trip SET endTs = NOW(), distanceKM = ? WHERE tripId = ?",
      [totalDistance, tripId]
    );

    res.json({
      message: "Trip ended",
      distanceKM: totalDistance.toFixed(2),
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
      "SELECT * FROM trip WHERE tripId = ?",
      [tripId]
    );

    const [points] = await sqlPool.query(
      "SELECT latitude, longitude, timestamp FROM TelemetryPoint WHERE tripId = ?",
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
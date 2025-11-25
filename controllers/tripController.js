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
      "INSERT INTO trip (userId, startTs, status) VALUES (?, NOW(), 'Started')",
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
    const { latitude, longitude, speed, acceleration } = req.body;

    const [previousPoint] = await sqlPool.query(
      "SELECT * FROM TelemetryPoint WHERE tripId = ? ORDER BY timestamp DESC LIMIT 1",
      [tripId]
    );

    console.log(previousPoint)


    await sqlPool.query(
      "INSERT INTO TelemetryPoint (tripId, latitude, longitude, speed, acceleration, timestamp) VALUES (?, ?, ?, ?, ?, NOW())",
      [tripId, latitude, longitude, speed, acceleration]
    );

    const [point] = await sqlPool.query(
      "SELECT * FROM TelemetryPoint WHERE tripId = ? ORDER BY timestamp DESC LIMIT 1",
      [tripId]
    );

    console.log(previousPoint, point);
    // Speeding event detection
    if (previousPoint[0]?.speed <= point[0]?.speed - 20) {
      const event_type = "Speeding";
      const severity = 10;
      const peakValue = point[0].speed;
      const latitude = point[0].latitude;
      const longitude = point[0].longitude;
      await sqlPool.query(
        `INSERT INTO TripEvent (tripId, type, severity, peakValue, latitude, longitude, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [tripId, event_type, severity || null, peakValue || null, latitude || null, longitude || null]
      );
    }

    // Harsh braking event detection
    if (previousPoint[0]?.speed > point[0].speed + 20) {
      const event_type = "Harsh_Brake";
      const severity = 8;
      const peakValue = previousPoint[0].speed - point[0].speed;
      const latitude = point[0].latitude;
      const longitude = point[0].longitude;
      await sqlPool.query(
        `INSERT INTO TripEvent (tripId, type, severity, peakValue, latitude, longitude, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [tripId, event_type, severity || null, peakValue || null, latitude || null, longitude || null]
      );
    }

    res.json({ message: "Point saved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};


const endTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const [tripExists] = await sqlPool.query(
      "SELECT * FROM Trip WHERE tripId = ?",
      [tripId]
    );

    if (tripExists.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (tripExists[0].status === 'Ended') {
      return res.status(400).json({ error: "Trip already ended" });
    }

    const [points] = await sqlPool.query(
      "SELECT latitude, longitude FROM TelemetryPoint WHERE tripId = ? ORDER BY timestamp ASC",
      [tripId]
    );

    if (points.length < 2) {
      return res.status(400).json({
        error: "Not enough points to calculate distance",
      });
    }

    /// dont know what this is doing
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += haversine(
        points[i].latitude,
        points[i].longitude,
        points[i + 1].latitude,
        points[i + 1].longitude
      );
    }

    const [eventsCount] = await sqlPool.query(
      "SELECT count(*) from TripEvent WHERE tripId = ?",
      [tripId]
    );

    const [rapidAccelCount] = await sqlPool.query(
      "SELECT count(*) from TripEvent WHERE tripId = ? AND type = 'Speeding'",
      [tripId]
    );

    const [harshBrakingCount] = await sqlPool.query(
      "SELECT count(*) from TripEvent WHERE tripId = ? AND type = 'Harsh_Brake'",
      [tripId]
    );

    const [maxSpeed] = await sqlPool.query(
      "SELECT max(peakValue) from TripEvent WHERE tripId = ?",
      [tripId]
    );

    await sqlPool.query( 
      "UPDATE trip SET endTs = NOW() WHERE tripId = ?",
      [tripId]
    );

    const [totalDuration] = await sqlPool.query(
      "SELECT endTs - startTs as durationSec FROM trip WHERE tripId = ?",
      [tripId]
    );

    const [averageSpeedKph] = await sqlPool.query(
      "SELECT avg(speed) as avgSpeed FROM TelemetryPoint WHERE tripId = ?",
      [tripId]
    );

    await sqlPool.query(
      "UPDATE trip SET distanceKM = ?, durationSec = ?, averageSpeedKph = ?, status = 'Ended' WHERE tripId = ?",
      [totalDistance, totalDuration[0].durationSec, averageSpeedKph[0].avgSpeed, tripId]
    );

    // Calculate total score based on events
    var TotalScore = 100;
    TotalScore -= rapidAccelCount[0]['count(*)'] * 2;
    TotalScore -= harshBrakingCount[0]['count(*)'] * 3;
    if (TotalScore < 0) TotalScore = 0;

    await sqlPool.query(
      "INSERT INTO TripSummary (tripId, eventsCount, rapidAccelCount, harshBrakingCount, maxSpeed,scoreTotal) VALUES (?, ?, ?, ?, ?, ?)",
      [tripId, eventsCount[0]['count(*)'], rapidAccelCount[0]['count(*)'], harshBrakingCount[0]['count(*)'], maxSpeed[0]['max(peakValue)'],
        TotalScore]
    );

    const [tripSummary] = await sqlPool.query(
      "SELECT * FROM Trip join TripSummary ON Trip.tripId = TripSummary.tripId WHERE Trip.tripId = ?",
      [tripId]
    );



    res.json({
      message: "Trip ended",
      ...tripSummary[0],
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { startTrip, addTripPoint, endTrip };
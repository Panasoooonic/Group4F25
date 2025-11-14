const { sqlPool } = require('../config/database');

const startTrip = async (req, res) => {
    res.send('Trip Started');

};

const logTelemetry = async (req, res) => {

}

const endTrip = async (req, res) => {

};

module.exports = { startTrip, endTrip, logTelemetry }
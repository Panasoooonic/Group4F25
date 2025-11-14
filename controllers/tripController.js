const Trip = require('../models/trip');

const startTrip = async (req, res) => {
    res.send('Trip Started');

};

const endTrip = async (req, res) => {

};

const logTelemetry = async (req, res) => {

}



module.exports = { startTrip, endTrip, logTelemetry }
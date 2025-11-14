const { sqlPool } = require('../config/database');

const logEvent = async (req, res) => {
    res.send('Log Event Endpoint');
};

const getEventsByTrip = async (req, res) => {

};

const getEventsByUser = async (req, res) => {

};

module.exports = { logEvent, getEventsByTrip, getEventsByUser }
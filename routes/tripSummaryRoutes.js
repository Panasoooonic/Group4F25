const express = require('express');
const router = express.Router();
const { getSummaryByTrip, getSummaryByTrip} = require('../controllers/tripSummaryController');
const { sqlPool } = require('../config/database');


const getSummaryByTrip = async (req,res) =>{

};

const getAllSummariesByUser = async (req,res) =>{

};

module.exports = { getSummaryByTrip, getAllSummariesByUser}
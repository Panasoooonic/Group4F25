const express = require('express');
const router = express.Router();
const { addVehicle, deleteVehicle, getVehiclesByUser, updateVehicle } = require('../controllers/vehicleController');
const { sqlPool } = require('../config/database');

//Test for /api/ user route

router.post('/add', addVehicle);
router.put('/update/:vehicleId', updateVehicle);
router.delete('/delete/:vehicleId', deleteVehicle);
router.get('/:userId', getVehiclesByUser);

module.exports = router;
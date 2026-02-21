const express = require('express');
const router = express.Router();
const { getDashboardStats, getVehicleROI } = require('../controllers/dashboardController');

router.get('/', getDashboardStats);
router.get('/roi/:vehicleId', getVehicleROI);

module.exports = router;

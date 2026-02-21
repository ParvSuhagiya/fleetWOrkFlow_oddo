const express = require('express');
const router = express.Router();
const { createFuelLog, getAllFuelLogs } = require('../controllers/fuelController');

router.get('/', getAllFuelLogs);
router.post('/', createFuelLog);

module.exports = router;

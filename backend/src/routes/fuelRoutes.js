const express = require('express');
const router = express.Router();
const { createFuelLog } = require('../controllers/fuelController');

router.post('/', createFuelLog);

module.exports = router;

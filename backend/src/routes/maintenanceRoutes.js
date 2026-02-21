const express = require('express');
const router = express.Router();
const { createMaintenance } = require('../controllers/maintenanceController');

router.post('/', createMaintenance);

module.exports = router;

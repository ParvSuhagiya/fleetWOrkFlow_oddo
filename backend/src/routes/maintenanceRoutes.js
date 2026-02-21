const express = require('express');
const router = express.Router();
const { createMaintenance, getAllMaintenance } = require('../controllers/maintenanceController');

router.get('/', getAllMaintenance);
router.post('/', createMaintenance);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    createDriver,
    getDrivers,
    updateDriver,
    deleteDriver
} = require('../controllers/driverController');

router.route('/')
    .post(createDriver)
    .get(getDrivers);

router.route('/:id')
    .put(updateDriver)
    .delete(deleteDriver);

module.exports = router;

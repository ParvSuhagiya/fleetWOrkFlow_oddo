const express = require('express');
const router = express.Router();
const {
    createVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');

router.route('/')
    .post(createVehicle)
    .get(getVehicles);

router.route('/:id')
    .put(updateVehicle)
    .delete(deleteVehicle);

module.exports = router;

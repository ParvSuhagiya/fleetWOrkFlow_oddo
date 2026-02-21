const express = require('express');
const router = express.Router();
const { createTrip, completeTrip, getAllTrips, updateTrip } = require('../controllers/tripController');

router.get('/', getAllTrips);
router.post('/', createTrip);
router.put('/:id/complete', completeTrip);
router.put('/:id', updateTrip);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createTrip, completeTrip } = require('../controllers/tripController');

router.post('/', createTrip);
router.put('/:id/complete', completeTrip);

module.exports = router;

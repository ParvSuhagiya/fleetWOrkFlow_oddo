const { FuelLog, Vehicle } = require('../models');

// @desc    Create a new fuel log
// @route   POST /api/fuel
// @access  Public
const createFuelLog = async (req, res) => {
    try {
        const { vehicleId, liters, cost, date } = req.body;

        // 1. Fetch vehicle to ensure it exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        // 2. Create fuel log
        const fuelLog = await FuelLog.create({
            vehicleId,
            liters,
            cost,
            date: date || Date.now()
        });

        console.log("✅ Fuel Log Added Successfully");
        res.status(201).json({
            success: true,
            data: fuelLog
        });

    } catch (error) {
        console.error("❌ Fuel Operation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createFuelLog
};

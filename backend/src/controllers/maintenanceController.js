const { Maintenance, Vehicle } = require('../models');

// @desc    Create a new maintenance log
// @route   POST /api/maintenance
// @access  Public
const createMaintenance = async (req, res) => {
    try {
        const { vehicleId, description, cost, date } = req.body;

        // 1. Fetch vehicle
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        // 2. Create maintenance log
        const maintenance = await Maintenance.create({
            vehicleId,
            description,
            cost,
            date: date || Date.now()
        });

        // 3. Update vehicle status to InShop
        vehicle.status = 'InShop';
        await vehicle.save();

        console.log("✅ Maintenance Logged & Vehicle Sent To Shop");
        res.status(201).json({
            success: true,
            data: maintenance
        });

    } catch (error) {
        console.error("❌ Maintenance Operation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all maintenance logs
// @route   GET /api/maintenance
// @access  Public
const getAllMaintenance = async (req, res) => {
    try {
        const logs = await Maintenance.find()
            .populate('vehicleId', 'make model licensePlate')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createMaintenance,
    getAllMaintenance
};

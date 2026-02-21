const { Vehicle } = require('../models');

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Public
const createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        console.log("✅ Vehicle Created Successfully");
        res.status(201).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        console.error("❌ Vehicle Operation Failed:", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        console.error("❌ Vehicle Operation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Public
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        console.error("❌ Vehicle Operation Failed:", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Public
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error("❌ Vehicle Operation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle
};

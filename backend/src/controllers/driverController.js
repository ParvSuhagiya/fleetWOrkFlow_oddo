const { Driver } = require('../models');

// @desc    Create a new driver
// @route   POST /api/drivers
// @access  Public
const createDriver = async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        console.log("✅ Driver Operation Successful");
        res.status(201).json({
            success: true,
            data: driver
        });
    } catch (error) {
        console.error("❌ Driver Operation Failed");
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Public
const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        console.log("✅ Driver Operation Successful");
        res.status(200).json({
            success: true,
            data: drivers
        });
    } catch (error) {
        console.error("❌ Driver Operation Failed");
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update a driver
// @route   PUT /api/drivers/:id
// @access  Public
const updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!driver) {
            console.error("❌ Driver Operation Failed");
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        console.log("✅ Driver Operation Successful");
        res.status(200).json({
            success: true,
            data: driver
        });
    } catch (error) {
        console.error("❌ Driver Operation Failed");
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a driver
// @route   DELETE /api/drivers/:id
// @access  Public
const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);

        if (!driver) {
            console.error("❌ Driver Operation Failed");
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        console.log("✅ Driver Operation Successful");
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error("❌ Driver Operation Failed");
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createDriver,
    getDrivers,
    updateDriver,
    deleteDriver
};

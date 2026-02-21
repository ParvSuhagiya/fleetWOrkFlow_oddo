const { Vehicle, Trip, FuelLog, Maintenance } = require('../models');

// @desc    Get dashboard aggregate statistics
// @route   GET /api/dashboard
// @access  Public
const getDashboardStats = async (req, res) => {
    try {
        const totalVehicles = await Vehicle.countDocuments();
        const vehiclesOnTrip = await Vehicle.countDocuments({ status: 'OnTrip' });
        const vehiclesInShop = await Vehicle.countDocuments({ status: 'InShop' });
        const totalTrips = await Trip.countDocuments();

        // Aggregate Fuel Costs
        const fuelStats = await FuelLog.aggregate([
            { $group: { _id: null, totalCost: { $sum: "$cost" } } }
        ]);
        const totalFuelCost = fuelStats.length > 0 ? fuelStats[0].totalCost : 0;

        // Aggregate Maintenance Costs
        const maintenanceStats = await Maintenance.aggregate([
            { $group: { _id: null, totalCost: { $sum: "$cost" } } }
        ]);
        const totalMaintenanceCost = maintenanceStats.length > 0 ? maintenanceStats[0].totalCost : 0;

        console.log("✅ Dashboard Analytics Calculated Successfully");

        res.status(200).json({
            success: true,
            data: {
                totalVehicles,
                vehiclesOnTrip,
                vehiclesInShop,
                totalTrips,
                totalFuelCost,
                totalMaintenanceCost
            }
        });
    } catch (error) {
        console.error("❌ Dashboard Calculation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get ROI for a specific vehicle
// @route   GET /api/dashboard/roi/:vehicleId
// @access  Public
const getVehicleROI = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        // Fetch total maintenance for this vehicle
        const maintenanceStats = await Maintenance.aggregate([
            { $match: { vehicleId: new require('mongoose').Types.ObjectId(vehicleId) } },
            { $group: { _id: null, totalCost: { $sum: "$cost" } } }
        ]);
        const maintenanceCost = maintenanceStats.length > 0 ? maintenanceStats[0].totalCost : 0;

        // Fetch total fuel for this vehicle
        const fuelStats = await FuelLog.aggregate([
            { $match: { vehicleId: new require('mongoose').Types.ObjectId(vehicleId) } },
            { $group: { _id: null, totalCost: { $sum: "$cost" } } }
        ]);
        const fuelCost = fuelStats.length > 0 ? fuelStats[0].totalCost : 0;

        // Dummy Revenue for ROI calculation
        const dummyRevenue = 500000;

        // ROI = (Revenue - (Maintenance + Fuel)) / 100000
        const roi = (dummyRevenue - (maintenanceCost + fuelCost)) / 100000;

        console.log("✅ Dashboard Analytics Calculated Successfully");

        res.status(200).json({
            success: true,
            data: {
                vehicleId,
                revenue: dummyRevenue,
                maintenanceCost,
                fuelCost,
                roi: roi.toFixed(2)
            }
        });
    } catch (error) {
        console.error("❌ Dashboard Calculation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getVehicleROI
};

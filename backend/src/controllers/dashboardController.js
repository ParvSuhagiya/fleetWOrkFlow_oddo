const { Vehicle, Trip, FuelLog, Maintenance } = require('../models');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Public (Will be protected later)
const getStats = async (req, res) => {
    try {
        const { region } = req.query;
        let vehicleFilter = {};
        if (region) vehicleFilter.region = region;

        // Statistics
        const totalVehicles = await Vehicle.countDocuments(vehicleFilter);
        const vehiclesOnTrip = await Vehicle.countDocuments({ ...vehicleFilter, status: 'OnTrip' });
        const vehiclesInShop = await Vehicle.countDocuments({ ...vehicleFilter, status: 'InShop' });
        const vehiclesAvailable = await Vehicle.countDocuments({ ...vehicleFilter, status: 'Available' });

        const totalTrips = await Trip.countDocuments();
        const pendingCargo = await Trip.countDocuments({ status: 'Draft' });

        // Utilization Rate: % of fleet assigned (OnTrip) vs available for service
        const activeVehicles = await Vehicle.countDocuments({ ...vehicleFilter, status: { $ne: 'Retired' } });
        const utilizationRate = activeVehicles > 0 ? ((vehiclesOnTrip / activeVehicles) * 100).toFixed(1) : 0;

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

        // Fetch Recent Trips (Dispatched)
        const liveTrips = await Trip.find({ status: 'Dispatched' })
            .populate('vehicleId', 'make model')
            .populate('driverId', 'name')
            .limit(5);

        // Fetch Critical Maintenance (InShop)
        const criticalAlerts = await Maintenance.find()
            .populate({
                path: 'vehicleId',
                match: { ...vehicleFilter, status: 'InShop' },
                select: 'make model licensePlate region'
            })
            .sort({ date: -1 })
            .limit(5);

        console.log("✅ Dashboard Analytics Calculated Successfully");

        res.status(200).json({
            success: true,
            data: {
                totalVehicles,
                vehiclesOnTrip,
                vehiclesInShop,
                vehiclesAvailable,
                totalTrips,
                pendingCargo,
                utilizationRate,
                totalFuelCost,
                totalMaintenanceCost,
                liveTrips,
                criticalAlerts: criticalAlerts.filter(a => a.vehicleId)
            }
        });
    } catch (error) {
        console.error("❌ Dashboard Operation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getStats
};

const { Trip, Vehicle, Driver } = require('../models');

// @desc    Create a new trip (Dispatch)
// @route   POST /api/trips
// @access  Public
const createTrip = async (req, res) => {
    try {
        const { vehicleId, driverId, cargoWeight, startOdometer } = req.body;

        // 1. Fetch vehicle
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        // 2. Cargo capacity check
        if (cargoWeight > vehicle.maxCapacity) {
            console.error("❌ Cargo exceeds vehicle capacity");
            return res.status(400).json({
                success: false,
                message: `Cargo weight (${cargoWeight}) exceeds vehicle capacity (${vehicle.maxCapacity})`
            });
        }

        // 3. Driver validation
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }

        // License expiry check
        if (new Date(driver.licenseExpiry) < new Date()) {
            console.error("❌ Driver license expired");
            return res.status(400).json({ success: false, message: "Driver license expired" });
        }

        // Check if vehicle/driver already on trip (Best practice)
        if (vehicle.status === 'OnTrip') {
            return res.status(400).json({ success: false, message: "Vehicle is already on a trip" });
        }
        if (driver.status === 'OnTrip') {
            return res.status(400).json({ success: false, message: "Driver is already on a trip" });
        }

        // 4 & 5. Update statuses
        vehicle.status = 'OnTrip';
        driver.status = 'OnTrip';

        await vehicle.save();
        await driver.save();

        // 6. Create Trip with status Dispatched
        const trip = await Trip.create({
            vehicleId,
            driverId,
            cargoWeight,
            startOdometer,
            status: 'Dispatched'
        });

        console.log("✅ Trip Created & Status Updated");
        res.status(201).json({
            success: true,
            data: trip
        });

    } catch (error) {
        console.error("❌ Trip Operation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Complete a trip
// @route   PUT /api/trips/:id/complete
// @access  Public
const completeTrip = async (req, res) => {
    try {
        const { endOdometer } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        if (trip.status === 'Completed') {
            return res.status(400).json({ success: false, message: "Trip is already completed" });
        }

        // 1. Update trip status
        trip.status = 'Completed';
        trip.endOdometer = endOdometer;
        await trip.save();

        // 2 & 3. Update vehicle and driver status
        const vehicle = await Vehicle.findById(trip.vehicleId);
        const driver = await Driver.findById(trip.driverId);

        if (vehicle) {
            vehicle.status = 'Available';
            vehicle.odometer = endOdometer; // Also update vehicle odometer
            await vehicle.save();
        }

        if (driver) {
            driver.status = 'Available';
            await driver.save();
        }

        console.log("✅ Trip Completed & Status Reset");
        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        console.error("❌ Trip Operation Failed:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createTrip,
    completeTrip
};

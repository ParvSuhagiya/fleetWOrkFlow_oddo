const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { Vehicle, Driver, Trip, Maintenance, FuelLog, User } = require('./src/models');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database for seeding...");

        // Clear existing data
        await Vehicle.deleteMany({});
        await Driver.deleteMany({});
        await Trip.deleteMany({});
        await Maintenance.deleteMany({});
        await FuelLog.deleteMany({});
        await User.deleteMany({});

        console.log("Cleared existing data.");

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const managerPass = await bcrypt.hash('admin123', salt);
        const dispatcherPass = await bcrypt.hash('dispatch123', salt);

        await User.insertMany([
            { name: "Super Manager", email: "manager@fleetflow.com", password: managerPass, role: "Manager" },
            { name: "Main Dispatcher", email: "dispatcher@fleetflow.com", password: dispatcherPass, role: "Dispatcher" }
        ]);

        // Create Drivers
        const drivers = await Driver.insertMany([
            { name: "John Doe", email: "john@fleetops.com", phone: "+1 555-0101", licenseNumber: "DL-98765", status: "Available", experience: 5, safetyScore: 98, licenseExpiry: new Date('2026-12-31') },
            { name: "Sarah Smith", email: "sarah@fleetops.com", phone: "+1 555-0102", licenseNumber: "DL-12345", status: "Available", experience: 8, safetyScore: 95, licenseExpiry: new Date('2027-06-30') },
            { name: "Mike Johnson", email: "mike@fleetops.com", phone: "+1 555-0103", licenseNumber: "DL-55443", status: "OnTrip", experience: 3, safetyScore: 72, licenseExpiry: new Date('2025-08-15') },
            { name: "Emily Davis", email: "emily@fleetops.com", phone: "+1 555-0104", licenseNumber: "DL-22331", status: "OnTrip", experience: 10, safetyScore: 88, licenseExpiry: new Date('2028-02-20') }
        ]);

        // Create Vehicles
        const vehicles = await Vehicle.insertMany([
            { make: "Mercedes", model: "Actros", year: 2023, licensePlate: "FT-101-TX", type: "Heavy Truck", odometer: 45000, status: "Available", driverId: drivers[0]._id, maxLoadCapacity: 25000, region: "Northern" },
            { make: "Volvo", model: "FH16", year: 2022, licensePlate: "FT-202-VX", type: "Semi-Trailer", odometer: 78000, status: "OnTrip", driverId: drivers[2]._id, maxLoadCapacity: 35000, region: "Southern" },
            { make: "Scania", model: "R500", year: 2023, licensePlate: "FT-303-SX", type: "Box Truck", odometer: 12000, status: "OnTrip", driverId: drivers[3]._id, maxLoadCapacity: 15000, region: "Eastern" },
            { make: "Tesla", model: "Semi", year: 2024, licensePlate: "FT-404-EX", type: "Electric Semi", odometer: 5000, status: "InShop", maxLoadCapacity: 40000, region: "Western" },
            { make: "Ford", model: "F-150", year: 2021, licensePlate: "FT-505-FX", type: "Van", odometer: 60000, status: "Retired", maxLoadCapacity: 3000, region: "Northern" }
        ]);

        // Create Trips
        await Trip.insertMany([
            { vehicleId: vehicles[1]._id, driverId: drivers[2]._id, cargoWeight: 15000, status: "Dispatched", startOdometer: 77500, source: "Los Angeles, CA", destination: "Phoenix, AZ" },
            { vehicleId: vehicles[2]._id, driverId: drivers[3]._id, cargoWeight: 8000, status: "Dispatched", startOdometer: 11800, source: "Seattle, WA", destination: "Portland, OR" },
            { vehicleId: vehicles[0]._id, driverId: drivers[0]._id, cargoWeight: 5000, status: "Completed", startOdometer: 44500, endOdometer: 45000, source: "New York, NY", destination: "Boston, MA" },
            { vehicleId: vehicles[0]._id, driverId: drivers[1]._id, cargoWeight: 6000, status: "Draft", startOdometer: 45000, source: "Chicago, IL", destination: "Detroit, MI" }
        ]);

        // Create Maintenance Logs
        await Maintenance.insertMany([
            { vehicleId: vehicles[3]._id, description: "Brake pad replacement and software update", cost: 1200, date: new Date() },
            { vehicleId: vehicles[1]._id, description: "Standard oil and filter change", cost: 450, date: new Date(Date.now() - 172800000) }
        ]);

        // Create Fuel Logs
        await FuelLog.insertMany([
            { vehicleId: vehicles[0]._id, liters: 150, cost: 600, date: new Date(Date.now() - 518400000) },
            { vehicleId: vehicles[1]._id, liters: 200, cost: 850, date: new Date(Date.now() - 432000000) },
            { vehicleId: vehicles[2]._id, liters: 100, cost: 420, date: new Date(Date.now() - 259200000) }
        ]);

        console.log("✅ Database Seeded Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Failed:", error.message);
        process.exit(1);
    }
};

seedData();

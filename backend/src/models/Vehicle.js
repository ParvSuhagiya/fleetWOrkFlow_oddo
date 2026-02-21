const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true, // e.g. Truck, Van, Bike
    },
    maxLoadCapacity: {
        type: Number,
        required: true,
        default: 1000,
    },
    region: {
        type: String,
        default: 'Northern',
    },
    status: {
        type: String,
        enum: ['Available', 'OnTrip', 'InShop', 'Retired'],
        default: 'Available',
    },
    odometer: {
        type: Number,
        required: true,
        default: 0,
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);

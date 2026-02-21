const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true,
    },
    maxCapacity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'OnTrip', 'InShop'],
        default: 'Available',
    },
    odometer: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);

const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    licenseExpiry: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'OnTrip', 'Suspended'],
        default: 'Available',
    },
    experience: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);

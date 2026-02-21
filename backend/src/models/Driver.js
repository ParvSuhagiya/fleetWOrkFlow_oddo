const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);

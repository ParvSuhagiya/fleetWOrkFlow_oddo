const Vehicle = require('./Vehicle');
const Driver = require('./Driver');
const Trip = require('./Trip');
const Maintenance = require('./Maintenance');
const FuelLog = require('./FuelLog');

console.log("✅ All Models Loaded Successfully");

module.exports = {
    Vehicle,
    Driver,
    Trip,
    Maintenance,
    FuelLog,
};

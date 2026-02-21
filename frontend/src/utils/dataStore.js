// ======================================================================
// FleetFlow Local Data Store — All data in localStorage, no backend
// ======================================================================

const STORAGE_KEYS = {
    users: 'ff_users',
    vehicles: 'ff_vehicles',
    drivers: 'ff_drivers',
    trips: 'ff_trips',
    maintenance: 'ff_maintenance',
    fuelLogs: 'ff_fuelLogs',
    seeded: 'ff_seeded',
};

// ── Helpers ────────────────────────────────────────────────────────────
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();

const getAll = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setAll = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ── Generic CRUD ──────────────────────────────────────────────────────
const crud = (key) => ({
    getAll: () => getAll(key),
    getById: (id) => getAll(key).find(item => item._id === id),
    create: (item) => {
        const items = getAll(key);
        const newItem = { _id: uid(), ...item, createdAt: now(), updatedAt: now() };
        items.unshift(newItem);
        setAll(key, items);
        return newItem;
    },
    update: (id, updates) => {
        const items = getAll(key);
        const idx = items.findIndex(item => item._id === id);
        if (idx === -1) return null;
        items[idx] = { ...items[idx], ...updates, updatedAt: now() };
        setAll(key, items);
        return items[idx];
    },
    remove: (id) => {
        const items = getAll(key).filter(item => item._id !== id);
        setAll(key, items);
    },
});

// ── Public Stores ─────────────────────────────────────────────────────
export const userStore = crud(STORAGE_KEYS.users);
export const vehicleStore = crud(STORAGE_KEYS.vehicles);
export const driverStore = crud(STORAGE_KEYS.drivers);
export const tripStore = crud(STORAGE_KEYS.trips);
export const maintenanceStore = crud(STORAGE_KEYS.maintenance);
export const fuelLogStore = crud(STORAGE_KEYS.fuelLogs);

// ── Auth helpers ──────────────────────────────────────────────────────
export const authStore = {
    register: (name, email, password, role) => {
        const users = getAll(STORAGE_KEYS.users);
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists with this email');
        }
        const user = { _id: uid(), name, email, password, role, createdAt: now() };
        users.push(user);
        setAll(STORAGE_KEYS.users, users);
        const { password: _, ...safe } = user;
        return safe;
    },
    login: (email, password) => {
        const users = getAll(STORAGE_KEYS.users);
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid email or password');
        const { password: _, ...safe } = user;
        return safe;
    },
};

// ── Trip Business Logic ───────────────────────────────────────────────
export const tripActions = {
    dispatch: (data) => {
        const { vehicleId, driverId, source, destination, cargoWeight, startOdometer } = data;
        const vehicle = vehicleStore.getById(vehicleId);
        const driver = driverStore.getById(driverId);
        if (!vehicle) throw new Error('Vehicle not found');
        if (!driver) throw new Error('Driver not found');
        if (vehicle.status === 'OnTrip') throw new Error('Vehicle is already on a trip');
        if (driver.status === 'OnTrip') throw new Error('Driver is already on a trip');
        if (cargoWeight > vehicle.maxLoadCapacity) {
            throw new Error(`Cargo (${cargoWeight}kg) exceeds capacity (${vehicle.maxLoadCapacity}kg)`);
        }
        if (driver.licenseExpiry && new Date(driver.licenseExpiry) < new Date()) {
            throw new Error('Driver license has expired');
        }
        // Update statuses
        vehicleStore.update(vehicleId, { status: 'OnTrip' });
        driverStore.update(driverId, { status: 'OnTrip' });
        return tripStore.create({
            vehicleId, driverId, source, destination, cargoWeight, startOdometer,
            status: 'Dispatched',
            vehicleName: `${vehicle.make} ${vehicle.model}`,
            vehiclePlate: vehicle.licensePlate,
            driverName: driver.name,
        });
    },
    complete: (tripId, endOdometer) => {
        const trip = tripStore.getById(tripId);
        if (!trip) throw new Error('Trip not found');
        vehicleStore.update(trip.vehicleId, { status: 'Available', odometer: endOdometer });
        driverStore.update(trip.driverId, { status: 'Available' });
        return tripStore.update(tripId, { status: 'Completed', endOdometer });
    },
    cancel: (tripId) => {
        const trip = tripStore.getById(tripId);
        if (!trip) throw new Error('Trip not found');
        if (trip.status === 'Dispatched') {
            vehicleStore.update(trip.vehicleId, { status: 'Available' });
            driverStore.update(trip.driverId, { status: 'Available' });
        }
        return tripStore.update(tripId, { status: 'Cancelled' });
    },
};

// ── Seed Data ─────────────────────────────────────────────────────────
export const seedDatabase = () => {
    if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

    // Users (one per role)
    const users = [
        { _id: 'u1', name: 'Rajesh Kumar', email: 'manager@fleetflow.com', password: 'admin123', role: 'Fleet Manager', createdAt: now() },
        { _id: 'u2', name: 'Priya Sharma', email: 'dispatcher@fleetflow.com', password: 'admin123', role: 'Dispatcher', createdAt: now() },
        { _id: 'u3', name: 'Amit Patel', email: 'safety@fleetflow.com', password: 'admin123', role: 'Safety Officer', createdAt: now() },
        { _id: 'u4', name: 'Neha Gupta', email: 'finance@fleetflow.com', password: 'admin123', role: 'Financial Analyst', createdAt: now() },
    ];

    const drivers = [
        { _id: 'd1', name: 'John Doe', email: 'john@fleet.com', phone: '+1 555-0101', licenseNumber: 'DL-98765', status: 'Available', experience: 5, safetyScore: 98, licenseExpiry: '2026-12-31', createdAt: now(), updatedAt: now() },
        { _id: 'd2', name: 'Sarah Smith', email: 'sarah@fleet.com', phone: '+1 555-0102', licenseNumber: 'DL-12345', status: 'Available', experience: 8, safetyScore: 95, licenseExpiry: '2027-06-30', createdAt: now(), updatedAt: now() },
        { _id: 'd3', name: 'Mike Johnson', email: 'mike@fleet.com', phone: '+1 555-0103', licenseNumber: 'DL-55443', status: 'OnTrip', experience: 3, safetyScore: 72, licenseExpiry: '2025-08-15', createdAt: now(), updatedAt: now() },
        { _id: 'd4', name: 'Emily Davis', email: 'emily@fleet.com', phone: '+1 555-0104', licenseNumber: 'DL-22331', status: 'OnTrip', experience: 10, safetyScore: 88, licenseExpiry: '2028-02-20', createdAt: now(), updatedAt: now() },
        { _id: 'd5', name: 'Rahul Verma', email: 'rahul@fleet.com', phone: '+1 555-0105', licenseNumber: 'DL-33221', status: 'Available', experience: 6, safetyScore: 45, licenseExpiry: '2025-03-01', createdAt: now(), updatedAt: now() },
        { _id: 'd6', name: 'Aisha Khan', email: 'aisha@fleet.com', phone: '+1 555-0106', licenseNumber: 'DL-77889', status: 'Available', experience: 2, safetyScore: 82, licenseExpiry: '2026-09-15', createdAt: now(), updatedAt: now() },
    ];

    const vehicles = [
        { _id: 'v1', make: 'Mercedes', model: 'Actros', year: 2023, licensePlate: 'FT-101-TX', type: 'Heavy Truck', odometer: 45000, status: 'Available', maxLoadCapacity: 25000, region: 'Northern', createdAt: now(), updatedAt: now() },
        { _id: 'v2', make: 'Volvo', model: 'FH16', year: 2022, licensePlate: 'FT-202-VX', type: 'Semi-Trailer', odometer: 78000, status: 'OnTrip', maxLoadCapacity: 35000, region: 'Southern', createdAt: now(), updatedAt: now() },
        { _id: 'v3', make: 'Scania', model: 'R500', year: 2023, licensePlate: 'FT-303-SX', type: 'Box Truck', odometer: 12000, status: 'OnTrip', maxLoadCapacity: 15000, region: 'Eastern', createdAt: now(), updatedAt: now() },
        { _id: 'v4', make: 'Tesla', model: 'Semi', year: 2024, licensePlate: 'FT-404-EX', type: 'Electric Semi', odometer: 5000, status: 'InShop', maxLoadCapacity: 40000, region: 'Western', createdAt: now(), updatedAt: now() },
        { _id: 'v5', make: 'Ford', model: 'F-150', year: 2021, licensePlate: 'FT-505-FX', type: 'Van', odometer: 60000, status: 'Retired', maxLoadCapacity: 3000, region: 'Northern', createdAt: now(), updatedAt: now() },
    ];

    const trips = [
        { _id: 't1', vehicleId: 'v2', driverId: 'd3', cargoWeight: 15000, status: 'Dispatched', startOdometer: 77500, source: 'Los Angeles, CA', destination: 'Phoenix, AZ', vehicleName: 'Volvo FH16', vehiclePlate: 'FT-202-VX', driverName: 'Mike Johnson', createdAt: now(), updatedAt: now() },
        { _id: 't2', vehicleId: 'v3', driverId: 'd4', cargoWeight: 8000, status: 'Dispatched', startOdometer: 11800, source: 'Seattle, WA', destination: 'Portland, OR', vehicleName: 'Scania R500', vehiclePlate: 'FT-303-SX', driverName: 'Emily Davis', createdAt: now(), updatedAt: now() },
        { _id: 't3', vehicleId: 'v1', driverId: 'd1', cargoWeight: 5000, status: 'Completed', startOdometer: 44500, endOdometer: 45000, source: 'New York, NY', destination: 'Boston, MA', vehicleName: 'Mercedes Actros', vehiclePlate: 'FT-101-TX', driverName: 'John Doe', createdAt: now(), updatedAt: now() },
        { _id: 't4', vehicleId: 'v1', driverId: 'd2', cargoWeight: 6000, status: 'Draft', startOdometer: 45000, source: 'Chicago, IL', destination: 'Detroit, MI', vehicleName: 'Mercedes Actros', vehiclePlate: 'FT-101-TX', driverName: 'Sarah Smith', createdAt: now(), updatedAt: now() },
    ];

    const maintenance = [
        { _id: 'm1', vehicleId: 'v4', vehicleName: 'Tesla Semi', vehiclePlate: 'FT-404-EX', description: 'Brake pad replacement and software update', cost: 1200, date: new Date().toISOString(), createdAt: now(), updatedAt: now() },
        { _id: 'm2', vehicleId: 'v2', vehicleName: 'Volvo FH16', vehiclePlate: 'FT-202-VX', description: 'Standard oil and filter change', cost: 450, date: new Date(Date.now() - 172800000).toISOString(), createdAt: now(), updatedAt: now() },
        { _id: 'm3', vehicleId: 'v1', vehicleName: 'Mercedes Actros', vehiclePlate: 'FT-101-TX', description: 'Tire rotation and alignment', cost: 800, date: new Date(Date.now() - 604800000).toISOString(), createdAt: now(), updatedAt: now() },
        { _id: 'm4', vehicleId: 'v3', vehicleName: 'Scania R500', vehiclePlate: 'FT-303-SX', description: 'Engine diagnostics and tune-up', cost: 950, date: new Date(Date.now() - 1209600000).toISOString(), createdAt: now(), updatedAt: now() },
    ];

    const fuelLogs = [
        { _id: 'f1', vehicleId: 'v1', vehicleName: 'Mercedes Actros', vehiclePlate: 'FT-101-TX', liters: 150, cost: 600, date: new Date(Date.now() - 518400000).toISOString(), createdAt: now(), updatedAt: now() },
        { _id: 'f2', vehicleId: 'v2', vehicleName: 'Volvo FH16', vehiclePlate: 'FT-202-VX', liters: 200, cost: 850, date: new Date(Date.now() - 432000000).toISOString(), createdAt: now(), updatedAt: now() },
        { _id: 'f3', vehicleId: 'v3', vehicleName: 'Scania R500', vehiclePlate: 'FT-303-SX', liters: 100, cost: 420, date: new Date(Date.now() - 259200000).toISOString(), createdAt: now(), updatedAt: now() },
        { _id: 'f4', vehicleId: 'v1', vehicleName: 'Mercedes Actros', vehiclePlate: 'FT-101-TX', liters: 180, cost: 720, date: new Date(Date.now() - 86400000).toISOString(), createdAt: now(), updatedAt: now() },
        { _id: 'f5', vehicleId: 'v4', vehicleName: 'Tesla Semi', vehiclePlate: 'FT-404-EX', liters: 0, cost: 95, date: new Date(Date.now() - 345600000).toISOString(), createdAt: now(), updatedAt: now() },
    ];

    setAll(STORAGE_KEYS.users, users);
    setAll(STORAGE_KEYS.drivers, drivers);
    setAll(STORAGE_KEYS.vehicles, vehicles);
    setAll(STORAGE_KEYS.trips, trips);
    setAll(STORAGE_KEYS.maintenance, maintenance);
    setAll(STORAGE_KEYS.fuelLogs, fuelLogs);
    localStorage.setItem(STORAGE_KEYS.seeded, 'true');
    console.log('✅ FleetFlow data seeded to localStorage');
};

// ── Initialize on import ──────────────────────────────────────────────
seedDatabase();

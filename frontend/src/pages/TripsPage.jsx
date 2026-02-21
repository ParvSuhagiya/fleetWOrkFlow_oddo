import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { Navigation, CheckCircle, XCircle, AlertCircle, Truck, Users } from 'lucide-react';

/**
 * Trips Page - Trip management and tracking
 */
const TripsPage = () => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Mock data for vehicles
  const vehicles = [
    { id: 1, name: 'Volvo FH16', licensePlate: 'VH-001' },
    { id: 2, name: 'Mercedes Actros', licensePlate: 'VH-002' },
    { id: 3, name: 'Scania R440', licensePlate: 'VH-003' },
    { id: 4, name: 'MAN TGX', licensePlate: 'VH-004' },
    { id: 5, name: 'DAF XF', licensePlate: 'VH-005' },
  ];

  // Mock data for drivers
  const drivers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Wilson' },
    { id: 5, name: 'Robert Brown' },
  ];

  // Mock trips data
  const [trips] = useState([
    {
      id: 1,
      vehicleId: 1,
      vehicleName: 'Volvo FH16',
      driverId: 1,
      driverName: 'John Doe',
      cargo: '5000 kg',
      status: 'success',
      statusText: 'In Progress',
      destination: 'New York',
      distance: '125 km',
    },
    {
      id: 2,
      vehicleId: 2,
      vehicleName: 'Mercedes Actros',
      driverId: 2,
      driverName: 'Jane Smith',
      cargo: '4500 kg',
      status: 'success',
      statusText: 'In Progress',
      destination: 'Boston',
      distance: '89 km',
    },
    {
      id: 3,
      vehicleId: 3,
      vehicleName: 'Scania R440',
      driverId: 3,
      driverName: 'Mike Johnson',
      cargo: '6200 kg',
      status: 'info',
      statusText: 'Pending',
      destination: 'Philadelphia',
      distance: '156 km',
    },
    {
      id: 4,
      vehicleId: 4,
      vehicleName: 'MAN TGX',
      driverId: 4,
      driverName: 'Sarah Wilson',
      cargo: '3800 kg',
      status: 'warning',
      statusText: 'Delayed',
      destination: 'Newark',
      distance: '45 km',
    },
    {
      id: 5,
      vehicleId: 5,
      vehicleName: 'DAF XF',
      driverId: 5,
      driverName: 'Robert Brown',
      cargo: '5500 kg',
      status: 'success',
      statusText: 'Completed',
      destination: 'Hartford',
      distance: '78 km',
    },
  ]);

  // Get vehicle name by ID
  const getVehicleName = (id) => {
    const vehicle = vehicles.find((v) => v.id === parseInt(id));
    return vehicle ? vehicle.name : '';
  };

  // Get driver name by ID
  const getDriverName = (id) => {
    const driver = drivers.find((d) => d.id === parseInt(id));
    return driver ? driver.name : '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.vehicleId || !formData.driverId || !formData.cargoWeight) {
      alert('Please fill all fields');
      return;
    }

    if (parseFloat(formData.cargoWeight) <= 0) {
      alert('Cargo weight must be greater than 0');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('✅ Trip UI Flow Working Successfully');
      setFormData({ vehicleId: '', driverId: '', cargoWeight: '' });
      setIsLoading(false);
    }, 800);
  };

  const handleCompleteTrip = (tripId) => {
    console.log('✅ Trip UI Flow Working Successfully');
    // Complete trip logic here
  };

  const handleCancelTrip = (tripId) => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      console.log('✅ Trip UI Flow Working Successfully');
      // Cancel trip logic here
    }
  };

  return (
    <Layout title="Trips">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Management</h1>
        <p className="text-gray-600">Create and manage fleet trips with real-time tracking</p>
      </div>

      {/* Trip Creation Card */}
      <Card title="Create New Trip" className="mb-8 bg-gradient-to-br from-blue-50 to-white">
        <form onSubmit={handleCreateTrip} className="space-y-4">
          {/* Vehicle Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Select Vehicle
              </div>
            </label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
            >
              <option value="">-- Choose a vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
          </div>

          {/* Driver Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                Select Driver
              </div>
            </label>
            <select
              name="driverId"
              value={formData.driverId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
            >
              <option value="">-- Choose a driver --</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cargo Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cargo Weight (kg)
            </label>
            <input
              type="number"
              name="cargoWeight"
              value={formData.cargoWeight}
              onChange={handleInputChange}
              placeholder="Enter cargo weight in kilograms"
              min="1"
              step="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Submit Button - Full Width */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Trip...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5" />
                Create Trip
              </>
            )}
          </button>
        </form>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Total Trips</p>
            <p className="text-3xl font-bold text-gray-900">{trips.length}</p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Active Trips</p>
            <p className="text-3xl font-bold text-green-600">
              {trips.filter((t) => t.status === 'success').length}
            </p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-yellow-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Delayed Trips</p>
            <p className="text-3xl font-bold text-yellow-600">
              {trips.filter((t) => t.status === 'warning').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Trips Table */}
      <Card title="Active Trips">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Driver</th>
                <th className="pb-3">Cargo</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <tr key={trip.id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-gray-900 font-medium">{trip.vehicleName}</td>
                    <td className="py-4 text-gray-700">{trip.driverName}</td>
                    <td className="py-4 text-gray-700">{trip.cargo}</td>
                    <td className="py-4">
                      <StatusBadge status={trip.status}>
                        {trip.statusText}
                      </StatusBadge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleCompleteTrip(trip.id)}
                          className="flex items-center gap-1 px-3 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors font-medium text-sm"
                          title="Complete Trip"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </button>
                        <button
                          onClick={() => handleCancelTrip(trip.id)}
                          className="flex items-center gap-1 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                          title="Cancel Trip"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No trips found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default TripsPage;

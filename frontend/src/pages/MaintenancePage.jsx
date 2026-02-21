import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { Wrench, AlertCircle, Calendar, DollarSign } from 'lucide-react';

/**
 * Maintenance Page - Track vehicle maintenance records
 */
const MaintenancePage = () => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    cost: '',
    date: '',
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

  // Mock maintenance history data
  const [maintenanceHistory] = useState([
    {
      id: 1,
      vehicleId: 1,
      vehicleName: 'Volvo FH16',
      description: 'Oil Change & Filter Replacement',
      cost: 450.00,
      date: '2026-02-15',
      status: 'completed',
      statusText: 'Completed',
    },
    {
      id: 2,
      vehicleId: 2,
      vehicleName: 'Mercedes Actros',
      description: 'Brake Pad Replacement',
      cost: 850.00,
      date: '2026-02-18',
      status: 'completed',
      statusText: 'Completed',
    },
    {
      id: 3,
      vehicleId: 3,
      vehicleName: 'Scania R440',
      description: 'Tire Rotation & Balance',
      cost: 320.00,
      date: '2026-02-20',
      status: 'warning',
      statusText: 'In Progress',
    },
    {
      id: 4,
      vehicleId: 1,
      vehicleName: 'Volvo FH16',
      description: 'Engine Diagnostic Check',
      cost: 275.00,
      date: '2026-02-12',
      status: 'completed',
      statusText: 'Completed',
    },
    {
      id: 5,
      vehicleId: 4,
      vehicleName: 'MAN TGX',
      description: 'Battery Replacement',
      cost: 620.00,
      date: '2026-02-10',
      status: 'completed',
      statusText: 'Completed',
    },
    {
      id: 6,
      vehicleId: 5,
      vehicleName: 'DAF XF',
      description: 'Transmission Fluid Change',
      cost: 1200.00,
      date: '2026-02-08',
      status: 'completed',
      statusText: 'Completed',
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.vehicleId || !formData.description || !formData.cost || !formData.date) {
      alert('Please fill all fields');
      return;
    }

    if (parseFloat(formData.cost) <= 0) {
      alert('Cost must be greater than 0');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('✅ Maintenance UI Working');
      setFormData({ vehicleId: '', description: '', cost: '', date: '' });
      setIsLoading(false);
    }, 800);
  };

  // Calculate total maintenance cost
  const totalCost = maintenanceHistory.reduce((sum, item) => sum + item.cost, 0);

  // Get vehicle name by ID
  const getVehicleName = (id) => {
    const vehicle = vehicles.find((v) => v.id === parseInt(id));
    return vehicle ? vehicle.name : '';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Layout title="Maintenance">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Management</h1>
        <p className="text-gray-600">Record and track vehicle maintenance activities</p>
      </div>

      {/* Maintenance Form Card */}
      <Card title="Record Maintenance" className="mb-8 bg-gradient-to-br from-yellow-50 to-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-yellow-600" />
                Select Vehicle
              </div>
            </label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-white"
            >
              <option value="">-- Choose a vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Oil Change, Brake Service, Tire Rotation..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none"
            />
          </div>

          {/* Cost and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Cost (USD)
                </div>
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="e.g., 450.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Date
                </div>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button - Yellow Theme */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Recording...
              </>
            ) : (
              <>
                <Wrench className="w-5 h-5" />
                Record Maintenance
              </>
            )}
          </button>
        </form>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-l-4 border-l-yellow-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Total Records</p>
            <p className="text-3xl font-bold text-gray-900">{maintenanceHistory.length}</p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Total Cost</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalCost)}</p>
          </div>
        </Card>
      </div>

      {/* Maintenance History Table */}
      <Card title="Maintenance History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {maintenanceHistory.length > 0 ? (
                maintenanceHistory.map((record) => (
                  <tr key={record.id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-gray-900 font-medium">{record.vehicleName}</td>
                    <td className="py-4 text-gray-700">{record.description}</td>
                    <td className="py-4 text-gray-700">{formatDate(record.date)}</td>
                    <td className="py-4 text-gray-900 font-semibold">{formatCurrency(record.cost)}</td>
                    <td className="py-4">
                      <StatusBadge status={record.status === 'completed' ? 'success' : 'warning'}>
                        {record.statusText}
                      </StatusBadge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No maintenance records found</p>
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

export default MaintenancePage;

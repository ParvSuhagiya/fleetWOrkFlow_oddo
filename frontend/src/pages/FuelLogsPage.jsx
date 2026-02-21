import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { Zap, AlertCircle, Calendar, DollarSign, Fuel } from 'lucide-react';

/**
 * Fuel Logs Page - Track fuel consumption and costs
 */
const FuelLogsPage = () => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    liters: '',
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

  // Mock fuel history data
  const [fuelHistory] = useState([
    {
      id: 1,
      vehicleId: 1,
      vehicleName: 'Volvo FH16',
      liters: 200,
      cost: 320.00,
      date: '2026-02-20',
      costPerLiter: 1.60,
      status: 'success',
      statusText: 'Recorded',
    },
    {
      id: 2,
      vehicleId: 2,
      vehicleName: 'Mercedes Actros',
      liters: 180,
      cost: 288.00,
      date: '2026-02-19',
      costPerLiter: 1.60,
      status: 'success',
      statusText: 'Recorded',
    },
    {
      id: 3,
      vehicleId: 3,
      vehicleName: 'Scania R440',
      liters: 220,
      cost: 352.00,
      date: '2026-02-18',
      costPerLiter: 1.60,
      status: 'success',
      statusText: 'Recorded',
    },
    {
      id: 4,
      vehicleId: 4,
      vehicleName: 'MAN TGX',
      liters: 190,
      cost: 304.00,
      date: '2026-02-17',
      costPerLiter: 1.60,
      status: 'success',
      statusText: 'Recorded',
    },
    {
      id: 5,
      vehicleId: 1,
      vehicleName: 'Volvo FH16',
      liters: 210,
      cost: 336.00,
      date: '2026-02-16',
      costPerLiter: 1.60,
      status: 'success',
      statusText: 'Recorded',
    },
    {
      id: 6,
      vehicleId: 5,
      vehicleName: 'DAF XF',
      liters: 175,
      cost: 280.00,
      date: '2026-02-15',
      costPerLiter: 1.60,
      status: 'success',
      statusText: 'Recorded',
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
    if (!formData.vehicleId || !formData.liters || !formData.cost || !formData.date) {
      alert('Please fill all fields');
      return;
    }

    if (parseFloat(formData.liters) <= 0) {
      alert('Liters must be greater than 0');
      return;
    }

    if (parseFloat(formData.cost) <= 0) {
      alert('Cost must be greater than 0');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('✅ Fuel Logging UI Working');
      setFormData({ vehicleId: '', liters: '', cost: '', date: '' });
      setIsLoading(false);
    }, 800);
  };

  // Calculate stats
  const totalLiters = fuelHistory.reduce((sum, item) => sum + item.liters, 0);
  const totalCost = fuelHistory.reduce((sum, item) => sum + item.cost, 0);
  const avgCostPerLiter = totalCost / totalLiters;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout title="Fuel Logs">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fuel Management</h1>
        <p className="text-gray-600">Log and track fuel consumption and costs</p>
      </div>

      {/* Fuel Log Form Card */}
      <Card title="Record Fuel Log" className="mb-8 bg-gradient-to-br from-green-50 to-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-green-600" />
                Select Vehicle
              </div>
            </label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
            >
              <option value="">-- Choose a vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
          </div>

          {/* Liters, Cost, and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Liters */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-blue-600" />
                  Liters
                </div>
              </label>
              <input
                type="number"
                name="liters"
                value={formData.liters}
                onChange={handleInputChange}
                placeholder="e.g., 200"
                min="1"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

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
                placeholder="e.g., 320.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  Date
                </div>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Log Fuel
              </>
            )}
          </button>
        </form>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Total Liters</p>
            <p className="text-3xl font-bold text-green-600">{totalLiters.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Across all vehicles</p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Total Cost</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalCost)}</p>
            <p className="text-xs text-gray-500 mt-2">All fuel purchases</p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-orange-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Avg Cost/Liter</p>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(avgCostPerLiter)}</p>
            <p className="text-xs text-gray-500 mt-2">Current rate</p>
          </div>
        </Card>
      </div>

      {/* Fuel History Table */}
      <Card title="Fuel History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Liters</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3">Cost/Liter</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fuelHistory.length > 0 ? (
                fuelHistory.map((record) => (
                  <tr key={record.id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-gray-900 font-medium">{record.vehicleName}</td>
                    <td className="py-4 text-gray-700">
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4 text-green-600" />
                        {record.liters} L
                      </div>
                    </td>
                    <td className="py-4 text-gray-900 font-semibold">{formatCurrency(record.cost)}</td>
                    <td className="py-4 text-gray-700">{formatCurrency(record.costPerLiter)}/L</td>
                    <td className="py-4 text-gray-700">{formatDate(record.date)}</td>
                    <td className="py-4">
                      <StatusBadge status="success">{record.statusText}</StatusBadge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No fuel logs found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        {fuelHistory.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Total Records</p>
                <p className="text-xl font-bold text-gray-900">{fuelHistory.length}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Total Fuel Used</p>
                <p className="text-xl font-bold text-green-600">{totalLiters} L</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Total Spent</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default FuelLogsPage;

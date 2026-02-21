import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

/**
 * Vehicles Management Page
 * Manage fleet vehicles with CRUD operations
 */
const VehiclesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    licensePlate: '',
    maxCapacity: '',
    odometer: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock vehicles data
  const [vehicles] = useState([
    {
      id: 1,
      name: 'Volvo FH16',
      licensePlate: 'VH-001',
      capacity: '25000 kg',
      odometer: '45,230 km',
      status: 'success',
      statusText: 'Active',
    },
    {
      id: 2,
      name: 'Mercedes Actros',
      licensePlate: 'VH-002',
      capacity: '20000 kg',
      odometer: '32,150 km',
      status: 'success',
      statusText: 'Active',
    },
    {
      id: 3,
      name: 'Scania R440',
      licensePlate: 'VH-003',
      capacity: '22000 kg',
      odometer: '28,890 km',
      status: 'warning',
      statusText: 'Maintenance',
    },
    {
      id: 4,
      name: 'MAN TGX',
      licensePlate: 'VH-004',
      capacity: '18000 kg',
      odometer: '51,420 km',
      status: 'success',
      statusText: 'Active',
    },
    {
      id: 5,
      name: 'DAF XF',
      licensePlate: 'VH-005',
      capacity: '24000 kg',
      odometer: '38,760 km',
      status: 'success',
      statusText: 'Active',
    },
    {
      id: 6,
      name: 'Iveco S-Way',
      licensePlate: 'VH-006',
      capacity: '20000 kg',
      odometer: '22,110 km',
      status: 'danger',
      statusText: 'Out of Service',
    },
  ]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedVehicles = vehicles.slice(startIdx, endIdx);

  const handleOpenModal = () => {
    setFormData({ name: '', licensePlate: '', maxCapacity: '', odometer: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', licensePlate: '', maxCapacity: '', odometer: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveVehicle = async () => {
    // Validate form
    if (!formData.name || !formData.licensePlate || !formData.maxCapacity || !formData.odometer) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('✅ Vehicle UI Operation Successful');
      setIsLoading(false);
      handleCloseModal();
    }, 800);
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      console.log('✅ Vehicle UI Operation Successful');
      // Delete logic here
    }
  };

  return (
    <Layout title="Vehicles">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Management</h1>
          <p className="text-gray-600">Manage your fleet vehicles and monitor their status</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Total Vehicles</p>
            <p className="text-3xl font-bold text-gray-900">{vehicles.length}</p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Active Vehicles</p>
            <p className="text-3xl font-bold text-blue-600">
              {vehicles.filter((v) => v.status === 'success').length}
            </p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-yellow-600">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">In Maintenance</p>
            <p className="text-3xl font-bold text-yellow-600">
              {vehicles.filter((v) => v.status !== 'success' && v.status !== 'danger').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card title="Vehicle Fleet">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                <th className="pb-3">Name</th>
                <th className="pb-3">License Plate</th>
                <th className="pb-3">Capacity</th>
                <th className="pb-3">Odometer</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedVehicles.length > 0 ? (
                displayedVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="text-sm hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 text-gray-900 font-medium">{vehicle.name}</td>
                    <td className="py-4 text-gray-700 font-mono">{vehicle.licensePlate}</td>
                    <td className="py-4 text-gray-700">{vehicle.capacity}</td>
                    <td className="py-4 text-gray-700">{vehicle.odometer}</td>
                    <td className="py-4">
                      <StatusBadge status={vehicle.status}>
                        {vehicle.statusText}
                      </StatusBadge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No vehicles found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {startIdx + 1} to {Math.min(endIdx, vehicles.length)} of{' '}
            {vehicles.length} vehicles
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* Add/Edit Vehicle Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Vehicle"
        onClose={handleCloseModal}
        onSave={handleSaveVehicle}
        isLoading={isLoading}
        saveText="Save Vehicle"
      >
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Vehicle Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Volvo FH16"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* License Plate Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              License Plate
            </label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleInputChange}
              placeholder="e.g., VH-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Max Capacity Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Max Capacity (kg)
            </label>
            <input
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleInputChange}
              placeholder="e.g., 25000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Odometer Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Odometer (km)
            </label>
            <input
              type="number"
              name="odometer"
              value={formData.odometer}
              onChange={handleInputChange}
              placeholder="e.g., 45230"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default VehiclesPage;

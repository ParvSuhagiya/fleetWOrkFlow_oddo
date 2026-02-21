import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { Users, Shield, AlertTriangle, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

/**
 * Drivers Page - Driver management with license tracking
 */
const DriversPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    licenseExpiry: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get today's date for comparison
  const today = new Date();
  const getTodayString = () => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Mock drivers data
  const [drivers] = useState([
    {
      id: 1,
      name: 'John Doe',
      licenseExpiry: '2026-12-15',
      status: 'success',
      statusText: 'Active',
      safetyRating: 9.5,
    },
    {
      id: 2,
      name: 'Jane Smith',
      licenseExpiry: '2025-08-20',
      status: 'danger',
      statusText: 'Expired',
      safetyRating: 8.8,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      licenseExpiry: '2026-03-10',
      status: 'warning',
      statusText: 'Expiring Soon',
      safetyRating: 7.2,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      licenseExpiry: '2025-11-30',
      status: 'danger',
      statusText: 'Expired',
      safetyRating: 9.1,
    },
    {
      id: 5,
      name: 'Robert Brown',
      licenseExpiry: '2027-06-22',
      status: 'success',
      statusText: 'Active',
      safetyRating: 8.9,
    },
  ]);

  // Calculate license status
  const getLicenseStatus = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'danger', statusText: 'Expired' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'warning', statusText: 'Expiring Soon' };
    }
    return { status: 'success', statusText: 'Active' };
  };

  // Check if license is expired
  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < today;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate stats
  const expiredCount = drivers.filter((d) => isExpired(d.licenseExpiry)).length;
  const activeCount = drivers.filter((d) => !isExpired(d.licenseExpiry)).length;

  const stats = [
    { title: 'Total Drivers', value: drivers.length.toString(), icon: Users, color: 'text-blue-600' },
    { title: 'Active License', value: activeCount.toString(), icon: Shield, color: 'text-green-600' },
    { title: 'Expired License', value: expiredCount.toString(), icon: AlertTriangle, color: 'text-red-600' },
  ];

  const handleOpenModal = () => {
    setFormData({ name: '', licenseExpiry: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', licenseExpiry: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveDriver = async () => {
    // Validate form
    if (!formData.name || !formData.licenseExpiry) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('✅ Driver UI Operation Successful');
      setIsLoading(false);
      handleCloseModal();
    }, 800);
  };

  const handleDeleteDriver = (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      console.log('✅ Driver UI Operation Successful');
      // Delete logic here
    }
  };

  return (
    <Layout title="Drivers">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Management</h1>
          <p className="text-gray-600">Manage drivers and track license expiry dates</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Driver
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-l-4 border-l-blue-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Drivers Table */}
      <Card title="Driver Profiles">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                <th className="pb-3">Name</th>
                <th className="pb-3">License Expiry</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drivers.length > 0 ? (
                drivers.map((driver) => {
                  const licenseExpired = isExpired(driver.licenseExpiry);
                  const licenseStatus = getLicenseStatus(driver.licenseExpiry);
                  
                  return (
                    <tr
                      key={driver.id}
                      className={`text-sm transition-colors ${
                        licenseExpired
                          ? 'bg-red-50 hover:bg-red-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-4 text-gray-900 font-medium">
                        <div className="flex items-center gap-2">
                          {licenseExpired && (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          {driver.name}
                        </div>
                      </td>
                      <td className="py-4 text-gray-700">
                        <span className={licenseExpired ? 'font-semibold text-red-600' : ''}>
                          {formatDate(driver.licenseExpiry)}
                        </span>
                      </td>
                      <td className="py-4">
                        <StatusBadge status={licenseStatus.status}>
                          {licenseStatus.statusText}
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
                            onClick={() => handleDeleteDriver(driver.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No drivers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Driver Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Driver"
        onClose={handleCloseModal}
        onSave={handleSaveDriver}
        isLoading={isLoading}
        saveText="Add Driver"
      >
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Driver Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* License Expiry Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              License Expiry Date
            </label>
            <input
              type="date"
              name="licenseExpiry"
              value={formData.licenseExpiry}
              onChange={handleInputChange}
              min={getTodayString()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Select the license expiry date</p>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default DriversPage;

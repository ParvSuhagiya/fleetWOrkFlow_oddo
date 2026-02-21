import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import {
  Truck,
  Navigation,
  Wrench,
  Zap,
  MapPin,
  AlertCircle,
  Loader,
} from 'lucide-react';

/**
 * Dashboard Page - Professional fleet management dashboard
 * Shows KPI cards, recent trips, and maintenance summary
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      console.log('✅ Dashboard UI Rendered Successfully');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // KPI Cards Data
  const kpiCards = [
    {
      title: 'Total Vehicles',
      value: '24',
      icon: Truck,
      borderColor: 'border-l-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'On Trip',
      value: '12',
      icon: Navigation,
      borderColor: 'border-l-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'In Shop',
      value: '3',
      icon: Wrench,
      borderColor: 'border-l-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Trips',
      value: '156',
      icon: Zap,
      borderColor: 'border-l-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  // Recent Trips Data
  const recentTrips = [
    {
      id: 1,
      tripId: 'T-2026-001',
      vehicle: 'VH-001',
      driver: 'John Doe',
      destination: 'New York',
      status: 'success',
      distance: '125 km',
      time: '2h 30m',
    },
    {
      id: 2,
      tripId: 'T-2026-002',
      vehicle: 'VH-002',
      driver: 'Jane Smith',
      destination: 'Boston',
      status: 'info',
      distance: '89 km',
      time: '1h 45m',
    },
    {
      id: 3,
      tripId: 'T-2026-003',
      vehicle: 'VH-003',
      driver: 'Mike Johnson',
      destination: 'Philadelphia',
      status: 'warning',
      distance: '156 km',
      time: '3h 15m',
    },
    {
      id: 4,
      tripId: 'T-2026-004',
      vehicle: 'VH-004',
      driver: 'Sarah Wilson',
      destination: 'Newark',
      status: 'success',
      distance: '45 km',
      time: '1h 10m',
    },
  ];

  // Fuel & Maintenance Summary
  const maintenanceItems = [
    {
      id: 1,
      vehicle: 'VH-001',
      type: 'Oil Change',
      dueDate: '2026-02-28',
      priority: 'danger',
      status: 'Overdue',
    },
    {
      id: 2,
      vehicle: 'VH-003',
      type: 'Tire Rotation',
      dueDate: '2026-02-25',
      priority: 'warning',
      status: 'Due Soon',
    },
    {
      id: 3,
      vehicle: 'VH-007',
      type: 'Brake Service',
      dueDate: '2026-03-10',
      priority: 'info',
      status: 'Scheduled',
    },
  ];

  const fuelStats = {
    avgMileage: '8.5 km/l',
    totalFuel: '45,234 liters',
    fuelCost: '$18,093.60',
    efficiency: 85,
  };

  // Loading Spinner
  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center">
            <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Monitor your fleet performance and manage operations efficiently.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${kpi.borderColor} hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">{kpi.title}</p>
                    <p className="text-4xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                  <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips - 2 columns */}
        <div className="lg:col-span-2">
          <Card title="Recent Trips">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <th className="pb-3">Trip ID</th>
                    <th className="pb-3">Vehicle</th>
                    <th className="pb-3">Driver</th>
                    <th className="pb-3">Destination</th>
                    <th className="pb-3">Distance</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="text-sm hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 text-gray-900 font-medium">{trip.tripId}</td>
                      <td className="py-4 text-gray-700">{trip.vehicle}</td>
                      <td className="py-4 text-gray-700">{trip.driver}</td>
                      <td className="py-4 text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {trip.destination}
                      </td>
                      <td className="py-4 text-gray-700">{trip.distance}</td>
                      <td className="py-4 text-gray-700 text-center">{trip.time}</td>
                      <td className="py-4">
                        <StatusBadge status={trip.status}>
                          {trip.status === 'success'
                            ? 'Completed'
                            : trip.status === 'info'
                            ? 'In Progress'
                            : 'Delayed'}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Fuel & Maintenance Summary - 1 column */}
        <div className="space-y-6">
          {/* Fuel Summary */}
          <Card title="Fuel Summary">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Avg Mileage</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {fuelStats.avgMileage}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Total Fuel</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fuelStats.totalFuel}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">Fuel Cost</p>
                <p className="text-3xl font-bold text-gray-900">
                  {fuelStats.fuelCost}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-xs font-medium">Efficiency</span>
                  <span className="text-green-600 font-semibold">
                    {fuelStats.efficiency}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${fuelStats.efficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Maintenance Alerts */}
          <Card title="Maintenance Alerts">
            <div className="space-y-3">
              {maintenanceItems.map((item) => (
                <div
                  key={item.id}
                  className="pb-3 border-b border-gray-200 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.vehicle}
                        </p>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.priority}>
                      {item.status}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;

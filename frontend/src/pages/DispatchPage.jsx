import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { Calendar, Zap, CheckCircle } from 'lucide-react';

/**
 * Dispatch Page - Trip dispatch and management
 */
const DispatchPage = () => {
  const { user } = useAuth();

  const trips = [
    { id: 'T001', from: 'Location A', to: 'Location B', driver: 'John Doe', status: 'success' },
    { id: 'T002', from: 'Location C', to: 'Location D', driver: 'Jane Smith', status: 'info' },
    { id: 'T003', from: 'Location E', to: 'Location F', driver: 'Mike Johnson', status: 'warning' },
  ];

  const stats = [
    { title: 'Today Trips', value: '8', icon: Calendar, color: 'text-blue-600' },
    { title: 'In Progress', value: '3', icon: Zap, color: 'text-yellow-600' },
    { title: 'Completed', value: '5', icon: CheckCircle, color: 'text-green-600' },
  ];

  return (
    <Layout title="Dispatch">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Dispatch</h1>
        <p className="text-gray-600">Create, manage, and monitor fleet trips and deliveries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-l-4 border-l-blue-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Active Trips">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="pb-3">Trip ID</th>
                <th className="pb-3">From</th>
                <th className="pb-3">To</th>
                <th className="pb-3">Driver</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.map((trip) => (
                <tr key={trip.id} className="text-sm hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-gray-900 font-medium">{trip.id}</td>
                  <td className="py-4 text-gray-700">{trip.from}</td>
                  <td className="py-4 text-gray-700">{trip.to}</td>
                  <td className="py-4 text-gray-700">{trip.driver}</td>
                  <td className="py-4">
                    <StatusBadge status={trip.status}>
                      {trip.status === 'success' ? 'Completed' : trip.status === 'info' ? 'In Progress' : 'Pending'}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default DispatchPage;

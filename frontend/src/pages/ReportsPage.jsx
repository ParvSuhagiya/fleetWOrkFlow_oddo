import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

/**
 * Reports Page - Financial and analytical reports
 */
const ReportsPage = () => {
  const { user } = useAuth();

  const reports = [
    { id: 1, type: 'Monthly Report', period: 'February 2026', amount: '$50,000', status: 'success' },
    { id: 2, type: 'Fuel Report', period: 'February 2026', amount: '$8,500', status: 'info' },
    { id: 3, type: 'Maintenance Report', period: 'February 2026', amount: '$3,200', status: 'warning' },
  ];

  const stats = [
    { title: 'Monthly Revenue', value: '$50,000', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Operating Costs', value: '$30,000', icon: TrendingDown, color: 'text-red-600' },
    { title: 'Net Profit', value: '$20,000', icon: DollarSign, color: 'text-blue-600' },
  ];

  return (
    <Layout title="Reports">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
        <p className="text-gray-600">View comprehensive financial and operational reports.</p>
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

      <Card title="Financial Summary">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="pb-3">Report Type</th>
                <th className="pb-3">Period</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="text-sm hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-gray-900 font-medium">{report.type}</td>
                  <td className="py-4 text-gray-700">{report.period}</td>
                  <td className="py-4 text-gray-700">{report.amount}</td>
                  <td className="py-4">
                    <StatusBadge status={report.status}>
                      {report.status === 'success' ? 'Completed' : report.status === 'info' ? 'In Progress' : 'Pending'}
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

export default ReportsPage;

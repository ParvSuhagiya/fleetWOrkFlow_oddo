import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { BarChart3, TrendingUp, AlertCircle, Zap, Wrench } from 'lucide-react';

/**
 * Analytics Page - Fleet analytics and performance metrics
 */
const AnalyticsPage = () => {
  // Mock vehicle analytics data
  const vehicleAnalytics = [
    {
      id: 1,
      name: 'Volvo FH16',
      licensePlate: 'VH-001',
      fuelCost: 2840.00,
      maintenanceCost: 1250.00,
      revenue: 8500.00,
    },
    {
      id: 2,
      name: 'Mercedes Actros',
      licensePlate: 'VH-002',
      fuelCost: 2560.00,
      maintenanceCost: 950.00,
      revenue: 7800.00,
    },
    {
      id: 3,
      name: 'Scania R440',
      licensePlate: 'VH-003',
      fuelCost: 3120.00,
      maintenanceCost: 2100.00,
      revenue: 9200.00,
    },
    {
      id: 4,
      name: 'MAN TGX',
      licensePlate: 'VH-004',
      fuelCost: 2380.00,
      maintenanceCost: 750.00,
      revenue: 7200.00,
    },
    {
      id: 5,
      name: 'DAF XF',
      licensePlate: 'VH-005',
      fuelCost: 2100.00,
      maintenanceCost: 620.00,
      revenue: 6800.00,
    },
  ];

  // Calculate ROI for each vehicle
  const vehiclesWithROI = vehicleAnalytics.map((vehicle) => {
    const totalCost = vehicle.fuelCost + vehicle.maintenanceCost;
    const roi = vehicle.revenue - totalCost;
    const roiPercentage = ((roi / totalCost) * 100).toFixed(2);
    return {
      ...vehicle,
      totalCost,
      roi,
      roiPercentage,
    };
  });

  // Calculate overall metrics
  const totalFuelCost = vehicleAnalytics.reduce((sum, v) => sum + v.fuelCost, 0);
  const totalMaintenanceCost = vehicleAnalytics.reduce((sum, v) => sum + v.maintenanceCost, 0);
  const totalCost = totalFuelCost + totalMaintenanceCost;
  const totalRevenue = vehicleAnalytics.reduce((sum, v) => sum + v.revenue, 0);
  const overallROI = totalRevenue - totalCost;
  const overallROIPercentage = ((overallROI / totalCost) * 100).toFixed(2);
  const fuelEfficiency = (totalRevenue / totalFuelCost).toFixed(2);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get ROI status badge color
  const getROIStatus = (roi) => {
    return roi >= 0 ? 'success' : 'danger';
  };

  // Calculate max ROI for bar visualization
  const maxROI = Math.max(...vehiclesWithROI.map((v) => Math.abs(v.roi)));

  React.useEffect(() => {
    console.log('✅ Analytics UI Loaded Successfully');
  }, []);

  return (
    <Layout title="Analytics">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fleet Analytics</h1>
        <p className="text-gray-600">
          Comprehensive analytics and performance metrics for your fleet
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Fuel Efficiency Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-blue-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-3">Fuel Efficiency</p>
              <p className="text-4xl font-bold text-blue-600 mb-1">{fuelEfficiency}x</p>
              <p className="text-sm text-gray-500">Revenue per fuel cost dollar</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Overall ROI Card */}
        <Card
          className={`bg-gradient-to-br to-white border-l-4 ${
            overallROI >= 0
              ? 'from-green-50 border-l-green-600'
              : 'from-red-50 border-l-red-600'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-3">Overall ROI</p>
              <p
                className={`text-4xl font-bold mb-1 ${
                  overallROI >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(overallROI)}
              </p>
              <p className="text-sm text-gray-500">{overallROIPercentage}% return on investment</p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                overallROI >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <TrendingUp
                className={`w-6 h-6 ${
                  overallROI >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Vehicle Analytics Table */}
      <Card title="Vehicle Performance Summary">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Fuel Cost</th>
                <th className="pb-3">Maintenance</th>
                <th className="pb-3">Total Cost</th>
                <th className="pb-3">ROI</th>
                <th className="pb-3">ROI %</th>
                <th className="pb-3">Visualization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehiclesWithROI.map((vehicle) => (
                <tr key={vehicle.id} className="text-sm hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-gray-900 font-medium">
                    <div>
                      <p>{vehicle.name}</p>
                      <p className="text-xs text-gray-500">{vehicle.licensePlate}</p>
                    </div>
                  </td>
                  <td className="py-4 text-gray-700">{formatCurrency(vehicle.fuelCost)}</td>
                  <td className="py-4 text-gray-700">
                    {formatCurrency(vehicle.maintenanceCost)}
                  </td>
                  <td className="py-4 text-gray-700 font-semibold">
                    {formatCurrency(vehicle.totalCost)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`font-bold ${
                        vehicle.roi >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(vehicle.roi)}
                    </span>
                  </td>
                  <td className="py-4">
                    <StatusBadge status={getROIStatus(vehicle.roi)}>
                      {vehicle.roiPercentage}%
                    </StatusBadge>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            vehicle.roi >= 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{
                            width: `${(Math.abs(vehicle.roi) / maxROI) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {((Math.abs(vehicle.roi) / maxROI) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-medium">Total Fleet</p>
              <p className="text-lg font-bold text-gray-900">{vehicleAnalytics.length}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Total Fuel Cost</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(totalFuelCost)}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Total Maintenance</p>
              <p className="text-lg font-bold text-yellow-600">
                {formatCurrency(totalMaintenanceCost)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Total Revenue</p>
              <p className="text-lg font-bold text-purple-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Fleet ROI</p>
              <p
                className={`text-lg font-bold ${
                  overallROI >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(overallROI)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <Card title="Key Insights" className="mt-8">
        <div className="space-y-3">
          <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
            <BarChart3 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Best Performing Vehicle</p>
              <p className="text-sm text-gray-600">
                {
                  vehiclesWithROI.reduce((prev, current) =>
                    prev.roi > current.roi ? prev : current
                  ).name
                }{' '}
                with {formatCurrency(Math.max(...vehiclesWithROI.map((v) => v.roi)))} ROI
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Highest Operating Cost</p>
              <p className="text-sm text-gray-600">
                {
                  vehiclesWithROI.reduce((prev, current) =>
                    prev.totalCost > current.totalCost ? prev : current
                  ).name
                }{' '}
                with {formatCurrency(Math.max(...vehiclesWithROI.map((v) => v.totalCost)))} cost
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Fleet Efficiency</p>
              <p className="text-sm text-gray-600">
                Your fleet generates {fuelEfficiency}x revenue for every dollar spent on fuel
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default AnalyticsPage;

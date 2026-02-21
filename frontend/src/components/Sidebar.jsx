import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Navigation,
  Wrench,
  Zap,
  BarChart3,
} from 'lucide-react';

/**
 * Sidebar Component
 * Left fixed navigation with menu items
 */
const Sidebar = () => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Vehicles',
      path: '/vehicles',
      icon: Truck,
    },
    {
      name: 'Drivers',
      path: '/drivers',
      icon: Users,
    },
    {
      name: 'Trips',
      path: '/trips',
      icon: Navigation,
    },
    {
      name: 'Maintenance',
      path: '/maintenance',
      icon: Wrench,
    },
    {
      name: 'Fuel Logs',
      path: '/fuel-logs',
      icon: Zap,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
    },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white pt-8 shadow-lg overflow-y-auto"
      style={{ backgroundColor: '#111827' }}
    >
      {/* Logo */}
      <div className="px-6 mb-12">
        <h1 className="text-2xl font-bold text-white">FleetFlow</h1>
        <p className="text-gray-400 text-xs mt-1">Fleet Management</p>
      </div>

      {/* Menu Items */}
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800 bg-gray-950">
        <p className="text-gray-400 text-xs text-center">
          © 2026 FleetFlow
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

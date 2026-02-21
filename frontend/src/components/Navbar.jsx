import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Settings } from 'lucide-react';

/**
 * Navbar Component
 * Professional top navbar with page title and user controls
 */
const Navbar = ({ title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-8 py-4 flex justify-between items-center">
        {/* Left: Page Title */}
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-6">
          {/* Notification Icon */}
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5" />
          </button>

          {/* Settings Icon */}
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Settings className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role || 'Admin'}</p>
              </div>
            )}

            {/* Avatar Circle */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

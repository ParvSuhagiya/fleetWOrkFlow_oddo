import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Users, Navigation2, Wrench, Fuel,
  LogOut, ShieldCheck
} from 'lucide-react';

const ROLE_NAV = {
  'Fleet Manager': [
    { to: '/', icon: LayoutDashboard, label: 'Command Center' },
    { to: '/vehicles', icon: Truck, label: 'Vehicles' },
    { to: '/drivers', icon: Users, label: 'Drivers' },
    { to: '/trips', icon: Navigation2, label: 'Trips' },
    { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/fuel', icon: Fuel, label: 'Fuel Logs' },
  ],
  'Dispatcher': [
    { to: '/', icon: LayoutDashboard, label: 'Command Center' },
    { to: '/vehicles', icon: Truck, label: 'Vehicles' },
    { to: '/drivers', icon: Users, label: 'Drivers' },
    { to: '/trips', icon: Navigation2, label: 'Trips' },
  ],
  'Safety Officer': [
    { to: '/', icon: LayoutDashboard, label: 'Command Center' },
    { to: '/drivers', icon: Users, label: 'Drivers' },
  ],
  'Financial Analyst': [
    { to: '/', icon: LayoutDashboard, label: 'Command Center' },
    { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/fuel', icon: Fuel, label: 'Fuel Logs' },
  ],
};

const ROLE_COLORS = {
  'Fleet Manager': '#06b6d4',
  'Dispatcher': '#8b5cf6',
  'Safety Officer': '#f59e0b',
  'Financial Analyst': '#10b981',
};

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navItems = ROLE_NAV[user.role] || ROLE_NAV['Fleet Manager'];
  const roleColor = ROLE_COLORS[user.role] || '#06b6d4';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-[260px] h-screen flex flex-col border-r border-white/5"
      style={{ background: 'linear-gradient(180deg, rgba(15,20,35,0.98) 0%, rgba(10,14,26,0.99) 100%)' }}>

      {/* Brand */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`, boxShadow: `0 0 20px ${roleColor}40` }}>
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">FleetFlow</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: roleColor }}>{user.role || 'System'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                ? 'text-white bg-white/8 shadow-lg'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/3'
              }`
            }
            style={({ isActive }) => isActive ? { borderLeft: `3px solid ${roleColor}` } : {}}>
            <item.icon size={18} className="transition-colors" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ background: `linear-gradient(135deg, ${roleColor}66, ${roleColor}33)` }}>
            {(user.name || 'U').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user.name || 'User'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user.email || ''}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer">
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

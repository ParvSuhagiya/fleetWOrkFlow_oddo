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
  'Fleet Manager': 'var(--accent-cyan)',
  'Dispatcher': 'var(--accent-purple)',
  'Safety Officer': 'var(--accent-yellow)',
  'Financial Analyst': 'var(--accent-teal)',
};

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navItems = ROLE_NAV[user.role] || ROLE_NAV['Fleet Manager'];
  const roleColor = ROLE_COLORS[user.role] || 'var(--accent-cyan)';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-[260px] h-screen flex flex-col border-r border-[var(--border-glass)]"
      style={{ background: 'var(--bg-sidebar)' }}>

      {/* Brand */}
      <div className="p-5 border-b border-[var(--border-glass)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{ background: `linear-gradient(135deg, ${roleColor}, var(--accent-blue))`, boxShadow: `0 8px 16px -4px ${roleColor}40` }}>
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[var(--text-primary)] tracking-tight">FleetFlow</h1>
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
                ? 'text-[var(--text-primary)] bg-[var(--bg-card-hover)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
              }`
            }
            style={({ isActive }) => isActive ? { borderLeft: `3px solid ${roleColor}` } : {}}>
            <item.icon size={18} className="transition-colors" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-[var(--border-glass)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ title: 'User Profile', background: `linear-gradient(135deg, ${roleColor}, var(--accent-blue))` }}>
            {(user.name || 'U').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user.name || 'User'}</p>
            <p className="text-[10px] text-[var(--text-secondary)] truncate">{user.email || ''}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-red)]/5 hover:bg-[var(--accent-red)]/10 text-[var(--accent-red)] hover:text-[var(--accent-red)] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border border-[var(--accent-red)]/10">
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

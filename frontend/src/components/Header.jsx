import React from 'react';
import { Bell, Search } from 'lucide-react';

const ROLE_COLORS = {
    'Fleet Manager': '#06b6d4',
    'Dispatcher': '#8b5cf6',
    'Safety Officer': '#f59e0b',
    'Financial Analyst': '#10b981',
};

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const roleColor = ROLE_COLORS[user.role] || '#06b6d4';

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5"
            style={{ background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(12px)' }}>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input type="text" placeholder="Search fleet..."
                        className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/10 w-64 transition-all" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: roleColor }}></span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold text-white">{user.name || 'User'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: roleColor }}>{user.role || 'System'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${roleColor}66, ${roleColor}33)` }}>
                        {(user.name || 'U').charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

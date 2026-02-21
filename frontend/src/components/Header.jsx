import React from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';

const ROLE_COLORS = {
    'Fleet Manager': 'var(--accent-cyan)',
    'Dispatcher': 'var(--accent-purple)',
    'Safety Officer': 'var(--accent-yellow)',
    'Financial Analyst': 'var(--accent-teal)',
};

const Header = ({ theme, toggleTheme }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const roleColor = ROLE_COLORS[user.role] || 'var(--accent-cyan)';

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-glass)] sticky top-0 z-40"
            style={{ background: 'var(--bg-header)', backdropFilter: 'var(--glass-blur)' }}>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type="text" placeholder="Search fleet..."
                        className="pl-9 pr-4 py-2 text-sm bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] w-64 transition-all" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all border border-[var(--border-subtle)]"
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <button className="relative p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all border border-[var(--border-subtle)]">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: roleColor }}></span>
                </button>

                <div className="flex items-center gap-3 ml-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-[var(--text-primary)]">{user.name || 'User'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: roleColor }}>{user.role || 'System'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ background: `linear-gradient(135deg, ${roleColor}, var(--accent-blue))` }}>
                        {(user.name || 'U').charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

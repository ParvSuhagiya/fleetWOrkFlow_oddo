import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { authStore, seedDatabase } from '../utils/dataStore';

const ROLES = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];

const DEMO_ACCOUNTS = [
    { role: 'Fleet Manager', email: 'manager@fleetflow.com', pass: 'admin123' },
    { role: 'Dispatcher', email: 'dispatcher@fleetflow.com', pass: 'admin123' },
    { role: 'Safety Officer', email: 'safety@fleetflow.com', pass: 'admin123' },
    { role: 'Financial Analyst', email: 'finance@fleetflow.com', pass: 'admin123' },
];

const Login = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: 'manager@fleetflow.com',
        password: 'admin123',
        role: 'Fleet Manager',
    });

    // Make sure data is seeded
    seedDatabase();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleDemoFill = (account) => {
        setForm({ ...form, email: account.email, password: account.pass, role: account.role });
        setIsRegister(false);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        try {
            let user;
            if (isRegister) {
                if (!form.name.trim()) { setError('Name is required'); return; }
                user = authStore.register(form.name, form.email, form.password, form.role);
            } else {
                user = authStore.login(form.email, form.password);
            }
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
        } catch (err) {
            setError(err.message || 'Authentication failed');
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4"
            style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), #0a0e1a' }}>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                        style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 40px rgba(6,182,212,0.3)' }}>
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">FleetFlow</h1>
                    <p className="text-gray-500 text-sm mt-1">Intelligent Fleet Command System</p>
                </div>

                {/* Card */}
                <div className="glass-card border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
                        {isRegister ? 'Create Account' : 'Authorize Access'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all"
                                    placeholder="Enter your full name" />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all"
                                placeholder="Enter your email" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none transition-all pr-12"
                                    placeholder="Enter password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {isRegister && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Role</label>
                                <select name="role" value={form.role} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500/50 focus:outline-none transition-all appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}>
                                    {ROLES.map(r => <option key={r} value={r} className="bg-gray-900">{r}</option>)}
                                </select>
                            </div>
                        )}

                        <button type="submit"
                            className="w-full py-3 rounded-xl text-white font-bold text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}>
                            {isRegister ? 'Create Account' : 'Authorize Access'}
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
                            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                        </button>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 glass-card border border-white/5 !p-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Demo Accounts (password: admin123)</p>
                    <div className="grid grid-cols-2 gap-2">
                        {DEMO_ACCOUNTS.map(a => (
                            <button key={a.role} onClick={() => handleDemoFill(a)}
                                className="text-left p-2.5 rounded-lg bg-white/3 hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer">
                                <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{a.role}</p>
                                <p className="text-[10px] text-gray-500 truncate">{a.email}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, ShieldAlert, BadgeCheck, AlertCircle, Star, Clock } from 'lucide-react';
import { driverStore } from '../utils/dataStore';
import Modal from '../components/Modal';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', licenseNumber: '',
        experience: 0, safetyScore: 100, licenseExpiry: ''
    });

    const fetchData = () => setDrivers(driverStore.getAll());
    useEffect(() => { fetchData(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'experience' || name === 'safetyScore' ? Number(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            driverStore.create({ ...formData, status: 'Available' });
            setIsModalOpen(false);
            setFormData({ name: '', email: '', phone: '', licenseNumber: '', experience: 0, safetyScore: 100, licenseExpiry: '' });
            fetchData();
        } catch (error) {
            alert("Failed: " + error.message);
        }
    };

    const handleDelete = (id) => {
        if (!window.confirm("Remove this driver?")) return;
        driverStore.remove(id);
        fetchData();
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-teal-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score) => {
        if (score >= 90) return 'bg-teal-500/10 border-teal-500/20';
        if (score >= 70) return 'bg-yellow-500/10 border-yellow-500/20';
        return 'bg-red-500/10 border-red-500/20';
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter italic">Driver <span className="text-cyan-400">Roster</span></h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Personnel management and compliance tracking</p>
                </div>
                <button onClick={() => setIsModalOpen(true)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer">
                    <Plus size={16} /> Add Driver
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                    <div key={driver._id} className="glass-card group relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl bg-gradient-to-br from-cyan-400 to-violet-500 transform group-hover:-rotate-3 transition-all">
                                    <Users size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tighter">{driver.name}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{driver.licenseNumber}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(driver._id)} className="p-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={18} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className={`p-3 rounded-xl border ${getScoreBg(driver.safetyScore || 0)}`}>
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Star size={10} /> Safety</p>
                                <p className={`text-lg font-black ${getScoreColor(driver.safetyScore || 0)}`}>{driver.safetyScore || 'N/A'}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10} /> Experience</p>
                                <p className="text-lg font-black text-white">{driver.experience}y</p>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 space-y-1 mb-4">
                            <p>{driver.email}</p>
                            <p>{driver.phone}</p>
                            {driver.licenseExpiry && (
                                <p className={`flex items-center gap-1 ${new Date(driver.licenseExpiry) < new Date() ? 'text-red-400' : 'text-gray-500'}`}>
                                    <AlertCircle size={10} />
                                    License: {new Date(driver.licenseExpiry).toLocaleDateString()}
                                    {new Date(driver.licenseExpiry) < new Date() && ' (EXPIRED)'}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black tracking-widest uppercase ${driver.status === 'Available' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                                driver.status === 'OnTrip' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                {driver.status === 'Available' && <BadgeCheck size={10} />}
                                {driver.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Driver">
                <form onSubmit={handleSubmit} className="p-2 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Full Name</label>
                        <input required name="name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Email</label>
                            <input required type="email" name="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none" placeholder="john@fleet.com" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Phone</label>
                            <input required name="phone" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none" placeholder="+1 555-0101" value={formData.phone} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">License Number</label>
                            <input required name="licenseNumber" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-cyan-500/50 focus:outline-none" placeholder="DL-12345" value={formData.licenseNumber} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">License Expiry</label>
                            <input required type="date" name="licenseExpiry" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none" value={formData.licenseExpiry} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Experience (Years)</label>
                            <input required type="number" name="experience" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none" value={formData.experience} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Safety Score (0-100)</label>
                            <input required type="number" min="0" max="100" name="safetyScore" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none" value={formData.safetyScore} onChange={handleInputChange} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-cyan-500/20 mt-4 cursor-pointer">
                        Register Driver
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Drivers;

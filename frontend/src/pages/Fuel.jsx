import React, { useState, useEffect } from 'react';
import { Fuel, Droplets, CreditCard, Plus, Truck, Calendar, Trash2, BarChart3 } from 'lucide-react';
import { fuelLogStore, vehicleStore } from '../utils/dataStore';
import Modal from '../components/Modal';

const FuelLogs = () => {
    const [fuelLogs, setFuelLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        vehicleId: '', liters: 0, cost: 0, date: new Date().toISOString().split('T')[0]
    });

    const fetchData = () => {
        setFuelLogs(fuelLogStore.getAll());
        setVehicles(vehicleStore.getAll());
    };
    useEffect(() => { fetchData(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const vehicle = vehicles.find(v => v._id === formData.vehicleId);
            fuelLogStore.create({
                ...formData,
                liters: Number(formData.liters),
                cost: Number(formData.cost),
                date: new Date(formData.date).toISOString(),
                vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown',
                vehiclePlate: vehicle ? vehicle.licensePlate : '',
            });
            setIsModalOpen(false);
            setFormData({ vehicleId: '', liters: 0, cost: 0, date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (error) {
            alert("Failed: " + error.message);
        }
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this record?")) return;
        fuelLogStore.remove(id);
        fetchData();
    };

    const totalCost = fuelLogs.reduce((s, f) => s + (f.cost || 0), 0);
    const totalLiters = fuelLogs.reduce((s, f) => s + (f.liters || 0), 0);
    const avgCostPerLiter = totalLiters > 0 ? (totalCost / totalLiters).toFixed(2) : 0;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter italic">Fuel <span className="text-yellow-400">Ledger</span></h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Fuel consumption tracking and spend analysis</p>
                </div>
                <button onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 cursor-pointer">
                    <Plus size={16} /> Add Entry
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-card">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Entries</p>
                    <p className="text-2xl font-black text-white">{fuelLogs.length}</p>
                </div>
                <div className="glass-card">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Spend</p>
                    <p className="text-2xl font-black text-yellow-400">${totalCost.toLocaleString()}</p>
                </div>
                <div className="glass-card">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Volume</p>
                    <p className="text-2xl font-black text-cyan-400">{totalLiters.toLocaleString()} L</p>
                </div>
                <div className="glass-card">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Avg $/Liter</p>
                    <p className="text-2xl font-black text-white">${avgCostPerLiter}</p>
                </div>
            </div>

            {/* Records */}
            <div className="space-y-3">
                {fuelLogs.map(log => (
                    <div key={log._id} className="glass-card flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                <Fuel size={22} className="text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white font-bold flex items-center gap-2">
                                    <Truck size={12} className="text-gray-500" /> {log.vehicleName || 'Vehicle'} <span className="text-gray-600 text-xs">{log.vehiclePlate || ''}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                    <Droplets size={10} /> {log.liters}L
                                    <span>•</span>
                                    <Calendar size={10} /> {new Date(log.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-black text-yellow-400">${log.cost}</span>
                            <button onClick={() => handleDelete(log._id)} className="p-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {fuelLogs.length === 0 && (
                    <div className="glass-card text-center py-12">
                        <Fuel size={48} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No fuel records yet.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Fuel Entry">
                <form onSubmit={handleSubmit} className="p-2 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Vehicle</label>
                        <select required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500/50 appearance-none focus:outline-none"
                            value={formData.vehicleId}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}>
                            <option value="" className="bg-gray-900">Select Vehicle</option>
                            {vehicles.map(v => <option key={v._id} value={v._id} className="bg-gray-900">{v.make} {v.model} ({v.licensePlate})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Liters</label>
                            <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500/50 focus:outline-none"
                                value={formData.liters}
                                onChange={(e) => setFormData(prev => ({ ...prev, liters: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Cost ($)</label>
                            <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500/50 focus:outline-none"
                                value={formData.cost}
                                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Date</label>
                        <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500/50 focus:outline-none"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-yellow-500/20 mt-4 cursor-pointer">
                        Log Fuel Entry
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default FuelLogs;

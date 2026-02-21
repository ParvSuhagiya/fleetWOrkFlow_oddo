import React, { useState, useEffect } from 'react';
import { Wrench, Calendar, Plus, DollarSign, Truck, Trash2 } from 'lucide-react';
import { maintenanceStore, vehicleStore } from '../utils/dataStore';
import Modal from '../components/Modal';

const Maintenance = () => {
    const [maintenance, setMaintenance] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        vehicleId: '', description: '', cost: 0, date: new Date().toISOString().split('T')[0]
    });

    const fetchData = () => {
        setMaintenance(maintenanceStore.getAll());
        setVehicles(vehicleStore.getAll());
    };
    useEffect(() => { fetchData(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const vehicle = vehicles.find(v => v._id === formData.vehicleId);
            maintenanceStore.create({
                ...formData,
                cost: Number(formData.cost),
                date: new Date(formData.date).toISOString(),
                vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown',
                vehiclePlate: vehicle ? vehicle.licensePlate : '',
            });
            setIsModalOpen(false);
            setFormData({ vehicleId: '', description: '', cost: 0, date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (error) {
            alert("Failed: " + error.message);
        }
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this record?")) return;
        maintenanceStore.remove(id);
        fetchData();
    };

    const totalCost = maintenance.reduce((s, m) => s + (m.cost || 0), 0);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)] mb-1 uppercase tracking-tighter italic">Maintenance <span className="text-[var(--accent-teal)]">Log</span></h2>
                    <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">Vehicle service records and work orders</p>
                </div>
                <button onClick={() => setIsModalOpen(true)}
                    className="bg-[var(--accent-teal)] hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer">
                    <Plus size={16} /> Add Record
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card">
                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Total Records</p>
                    <p className="text-2xl font-black text-[var(--text-primary)]">{maintenance.length}</p>
                </div>
                <div className="glass-card">
                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Total Cost</p>
                    <p className="text-2xl font-black text-[var(--accent-teal)]">${totalCost.toLocaleString()}</p>
                </div>
                <div className="glass-card">
                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Avg Per Service</p>
                    <p className="text-2xl font-black text-[var(--text-primary)]">${maintenance.length ? Math.round(totalCost / maintenance.length).toLocaleString() : 0}</p>
                </div>
            </div>

            {/* Records */}
            <div className="space-y-3">
                {maintenance.map(record => (
                    <div key={record._id} className="glass-card flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/20 flex items-center justify-center">
                                <Wrench size={22} className="text-[var(--accent-teal)]" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-primary)] font-bold">{record.description}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                                    <Truck size={10} /> {record.vehicleName || 'Vehicle'} ({record.vehiclePlate || ''})
                                    <span>•</span>
                                    <Calendar size={10} /> {new Date(record.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-black text-[var(--accent-teal)] flex items-center gap-1"><DollarSign size={16} />{record.cost}</span>
                            <button onClick={() => handleDelete(record._id)} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {maintenance.length === 0 && (
                    <div className="glass-card text-center py-12">
                        <Wrench size={48} className="text-[var(--text-muted)] opacity-20 mx-auto mb-4" />
                        <p className="text-[var(--text-muted)] text-sm">No maintenance records yet.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Maintenance Record">
                <form onSubmit={handleSubmit} className="p-2 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">Vehicle</label>
                        <select required className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-teal)]/50 appearance-none focus:outline-none"
                            value={formData.vehicleId}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}>
                            <option value="" className="bg-[var(--bg-sidebar)]">Select Vehicle</option>
                            {vehicles.map(v => <option key={v._id} value={v._id} className="bg-[var(--bg-sidebar)]">{v.make} {v.model} ({v.licensePlate})</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">Description</label>
                        <textarea required className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-teal)]/50 focus:outline-none resize-none" rows={3} placeholder="Describe the maintenance work..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">Cost ($)</label>
                            <input required type="number" className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-teal)]/50 focus:outline-none"
                                value={formData.cost}
                                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">Date</label>
                            <input required type="date" className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-teal)]/50 focus:outline-none"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-[var(--accent-teal)] to-teal-600 hover:opacity-90 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-500/20 mt-4 cursor-pointer">
                        Add Record
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Maintenance;

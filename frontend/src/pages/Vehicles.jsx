import React, { useState, useEffect } from 'react';
import { Truck, Plus, Trash2, MapPin, Gauge, ShieldAlert, BadgeCheck, AlertCircle, ArrowDownCircle } from 'lucide-react';
import { vehicleStore } from '../utils/dataStore';
import Modal from '../components/Modal';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        make: '', model: '', year: new Date().getFullYear(), licensePlate: '',
        type: 'Truck', maxLoadCapacity: 5000, region: 'Northern', odometer: 0
    });

    const fetchData = () => setVehicles(vehicleStore.getAll());
    useEffect(() => { fetchData(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'maxLoadCapacity' || name === 'year' || name === 'odometer' ? Number(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            vehicleStore.create({ ...formData, status: 'Available' });
            setIsModalOpen(false);
            setFormData({ make: '', model: '', year: new Date().getFullYear(), licensePlate: '', type: 'Truck', maxLoadCapacity: 5000, region: 'Northern', odometer: 0 });
            fetchData();
        } catch (error) {
            alert("Failed: " + error.message);
        }
    };

    const handleDelete = (id) => {
        if (!window.confirm("Remove this asset?")) return;
        vehicleStore.remove(id);
        fetchData();
    };

    const handleRetire = (id, status) => {
        const newStatus = status === 'Retired' ? 'Available' : 'Retired';
        if (!window.confirm(`Mark as ${newStatus}?`)) return;
        vehicleStore.update(id, { status: newStatus });
        fetchData();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter italic">Asset <span className="text-teal-400">Registry</span></h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Physical fleet inventory and lifecycle management</p>
                </div>
                <button onClick={() => setIsModalOpen(true)}
                    className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer">
                    <Plus size={16} /> Add Vehicle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                    <div key={vehicle._id} className={`glass-card group relative ${vehicle.status === 'Retired' ? 'opacity-50 grayscale' : ''}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:-rotate-3 transition-all ${vehicle.status === 'Retired' ? 'bg-gray-700' : 'bg-gradient-to-br from-teal-400 to-blue-500'}`}>
                                    <Truck size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tighter uppercase italic">
                                        {vehicle.make} {vehicle.model}
                                    </h3>
                                    <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">{vehicle.licensePlate} • {vehicle.year}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(vehicle._id)} className="p-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={18} /></button>
                                <button onClick={() => handleRetire(vehicle._id, vehicle.status)} className={`p-2 transition-colors cursor-pointer ${vehicle.status === 'Retired' ? 'text-teal-400' : 'text-gray-700 hover:text-yellow-500'}`}><ArrowDownCircle size={18} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><ShieldAlert size={10} className="text-teal-400" /> Load Limit</p>
                                <p className="text-sm font-black text-white">{vehicle.maxLoadCapacity} KG</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Gauge size={10} className="text-blue-400" /> Odometer</p>
                                <p className="text-sm font-black text-white">{vehicle.odometer} KM</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-gray-600" />
                                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{vehicle.region || 'NORTHERN'}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black tracking-widest uppercase ${vehicle.status === 'Available' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                                vehicle.status === 'OnTrip' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    vehicle.status === 'Retired' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                {vehicle.status === 'Available' && <BadgeCheck size={10} />}
                                {vehicle.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Physical Asset">
                <form onSubmit={handleSubmit} className="p-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Make / Brand</label>
                            <input required name="make" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500/50 focus:outline-none" placeholder="e.g. Scania" value={formData.make} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Model / Class</label>
                            <input required name="model" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500/50 focus:outline-none" placeholder="e.g. R500" value={formData.model} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">License Plate</label>
                            <input required name="licensePlate" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[12px] text-white font-mono focus:border-teal-500/50 focus:outline-none" placeholder="XYZ-999" value={formData.licensePlate} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Vehicle Type</label>
                            <select name="type" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500/50 appearance-none focus:outline-none" value={formData.type} onChange={handleInputChange}>
                                <option value="Heavy Truck" className="bg-gray-900">Heavy Truck</option>
                                <option value="Semi-Trailer" className="bg-gray-900">Semi-Trailer</option>
                                <option value="Box Truck" className="bg-gray-900">Box Truck</option>
                                <option value="Van" className="bg-gray-900">Cargo Van</option>
                                <option value="Electric Semi" className="bg-gray-900">Electric Semi</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Load Limit (KG)</label>
                            <input required type="number" name="maxLoadCapacity" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500/50 focus:outline-none" value={formData.maxLoadCapacity} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Region</label>
                            <select name="region" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500/50 appearance-none focus:outline-none" value={formData.region} onChange={handleInputChange}>
                                <option value="Northern" className="bg-gray-900">Northern</option>
                                <option value="Southern" className="bg-gray-900">Southern</option>
                                <option value="Eastern" className="bg-gray-900">Eastern</option>
                                <option value="Western" className="bg-gray-900">Western</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Asset Year</label>
                            <input required type="number" name="year" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500/50 focus:outline-none" value={formData.year} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Current Odometer</label>
                            <input required type="number" name="odometer" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500/50 focus:outline-none" value={formData.odometer} onChange={handleInputChange} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-teal-500/20 mt-4 cursor-pointer">
                        Authorize Registry
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Vehicles;

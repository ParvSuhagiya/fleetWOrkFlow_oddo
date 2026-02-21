import React, { useState, useEffect } from 'react';
import { Navigation2, Calendar, MapPin, Clock, ArrowRight, CheckCircle2, AlertCircle, XCircle, Plus } from 'lucide-react';
import { tripStore, tripActions, vehicleStore, driverStore } from '../utils/dataStore';
import Modal from '../components/Modal';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [dispatchData, setDispatchData] = useState({
        vehicleId: '', driverId: '', source: '', destination: '',
        cargoWeight: 0, startOdometer: 0
    });
    const [endOdometer, setEndOdometer] = useState(0);

    const fetchData = () => {
        setTrips(tripStore.getAll());
        setVehicles(vehicleStore.getAll().filter(v => v.status === 'Available'));
        setDrivers(driverStore.getAll().filter(d => d.status === 'Available'));
    };
    useEffect(() => { fetchData(); }, []);

    const handleDispatchSubmit = (e) => {
        e.preventDefault();
        try {
            tripActions.dispatch(dispatchData);
            setIsDispatchModalOpen(false);
            setDispatchData({ vehicleId: '', driverId: '', source: '', destination: '', cargoWeight: 0, startOdometer: 0 });
            fetchData();
        } catch (error) {
            alert("Dispatch failed: " + error.message);
        }
    };

    const handleCompleteSubmit = (e) => {
        e.preventDefault();
        if (!selectedTrip) return;
        try {
            tripActions.complete(selectedTrip._id, endOdometer);
            setIsCompleteModalOpen(false);
            setSelectedTrip(null);
            setEndOdometer(0);
            fetchData();
        } catch (error) {
            alert("Complete failed: " + error.message);
        }
    };

    const handleCancel = (tripId) => {
        if (!window.confirm("Cancel this trip?")) return;
        try {
            tripActions.cancel(tripId);
            fetchData();
        } catch (error) {
            alert("Cancel failed: " + error.message);
        }
    };

    const openCompleteModal = (trip) => {
        setSelectedTrip(trip);
        setEndOdometer(trip.startOdometer + 500);
        setIsCompleteModalOpen(true);
    };

    const statusConfig = {
        Dispatched: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: Navigation2 },
        Draft: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: Clock },
        Completed: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', icon: CheckCircle2 },
        Cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: XCircle },
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter italic">Trip <span className="text-violet-400">Manifest</span></h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Dispatch control and cargo routing</p>
                </div>
                <button onClick={() => setIsDispatchModalOpen(true)}
                    className="bg-violet-500 hover:bg-violet-400 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2 cursor-pointer">
                    <Plus size={16} /> New Assignment
                </button>
            </div>

            <div className="space-y-4">
                {trips.map(trip => {
                    const config = statusConfig[trip.status] || statusConfig.Draft;
                    const StatusIcon = config.icon;
                    return (
                        <div key={trip._id} className="glass-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} ${config.border} border`}>
                                        <StatusIcon size={22} className={config.text} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-white font-bold text-sm">{trip.source || 'Origin'}</span>
                                            <ArrowRight size={14} className="text-gray-600" />
                                            <span className="text-white font-bold text-sm">{trip.destination || 'Destination'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span>{trip.vehicleName || 'Vehicle'} ({trip.vehiclePlate || ''})</span>
                                            <span>•</span>
                                            <span>{trip.driverName || 'Driver'}</span>
                                            <span>•</span>
                                            <span>{trip.cargoWeight}kg cargo</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg border ${config.bg} ${config.text} ${config.border}`}>
                                        {trip.status}
                                    </span>
                                    {trip.status === 'Dispatched' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => openCompleteModal(trip)}
                                                className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-teal-500/20 transition-all cursor-pointer">
                                                Complete
                                            </button>
                                            <button onClick={() => handleCancel(trip._id)}
                                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all cursor-pointer">
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {trips.length === 0 && (
                    <div className="glass-card text-center py-12">
                        <Navigation2 size={48} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No trips found. Create a new assignment to get started.</p>
                    </div>
                )}
            </div>

            {/* DISPATCH MODAL */}
            <Modal isOpen={isDispatchModalOpen} onClose={() => setIsDispatchModalOpen(false)} title="New Trip Assignment">
                <form onSubmit={handleDispatchSubmit} className="p-2 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Vehicle</label>
                        <select required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 appearance-none focus:outline-none"
                            value={dispatchData.vehicleId}
                            onChange={(e) => {
                                const v = vehicles.find(v => v._id === e.target.value);
                                setDispatchData(prev => ({ ...prev, vehicleId: e.target.value, startOdometer: v ? v.odometer : 0 }));
                            }}>
                            <option value="" className="bg-gray-900">Select Vehicle</option>
                            {vehicles.map(v => <option key={v._id} value={v._id} className="bg-gray-900">{v.make} {v.model} ({v.licensePlate}) — {v.maxLoadCapacity}kg max</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Driver</label>
                        <select required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 appearance-none focus:outline-none"
                            value={dispatchData.driverId}
                            onChange={(e) => setDispatchData(prev => ({ ...prev, driverId: e.target.value }))}>
                            <option value="" className="bg-gray-900">Select Driver</option>
                            {drivers.map(d => <option key={d._id} value={d._id} className="bg-gray-900">{d.name} (Score: {d.safetyScore})</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Origin</label>
                            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 focus:outline-none" placeholder="Los Angeles, CA"
                                value={dispatchData.source}
                                onChange={(e) => setDispatchData(prev => ({ ...prev, source: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Destination</label>
                            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 focus:outline-none" placeholder="Phoenix, AZ"
                                value={dispatchData.destination}
                                onChange={(e) => setDispatchData(prev => ({ ...prev, destination: e.target.value }))} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Cargo Weight (KG)</label>
                            <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 focus:outline-none"
                                value={dispatchData.cargoWeight}
                                onChange={(e) => setDispatchData(prev => ({ ...prev, cargoWeight: Number(e.target.value) }))} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Start Odometer</label>
                            <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 focus:outline-none"
                                value={dispatchData.startOdometer}
                                onChange={(e) => setDispatchData(prev => ({ ...prev, startOdometer: Number(e.target.value) }))} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-violet-500 to-cyan-600 hover:from-violet-400 hover:to-cyan-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-violet-500/20 mt-4 cursor-pointer">
                        Authorize Dispatch
                    </button>
                </form>
            </Modal>

            {/* COMPLETE MODAL */}
            <Modal isOpen={isCompleteModalOpen} onClose={() => setIsCompleteModalOpen(false)} title="Complete Trip">
                <form onSubmit={handleCompleteSubmit} className="p-2 space-y-4">
                    {selectedTrip && (
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-4">
                            <p className="text-sm text-white font-bold">{selectedTrip.source} → {selectedTrip.destination}</p>
                            <p className="text-xs text-gray-500 mt-1">{selectedTrip.vehicleName} • Start ODO: {selectedTrip.startOdometer}</p>
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">End Odometer</label>
                        <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500/50 focus:outline-none"
                            value={endOdometer}
                            onChange={(e) => setEndOdometer(Number(e.target.value))} />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-teal-500/20 mt-4 cursor-pointer">
                        Confirm Completion
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Trips;

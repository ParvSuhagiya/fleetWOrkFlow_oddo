import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Truck, Users, MapPin, Activity, DollarSign, ArrowUpRight,
    Navigation2, CheckCircle2, AlertTriangle, ShieldAlert, Clock,
    Fuel, Wrench, BarChart3, Layers, Boxes, BadgeCheck, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { vehicleStore, driverStore, tripStore, maintenanceStore, fuelLogStore } from '../utils/dataStore';

// ── Stat Card ─────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }) => (
    <div className="glass-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ backgroundColor: color }}></div>
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]" style={{ color }}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${trend === 'Critical' ? 'bg-red-500/10 text-red-500' : trend === 'Warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-teal-500/10 text-teal-500'}`}>
                    {trend === 'Active' && <ArrowUpRight size={12} />}
                    {trend}
                </div>
            )}
        </div>
        <h3 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">{title}</h3>
        <p className="text-3xl font-black text-[var(--text-primary)] mt-1 tracking-tighter">{value}</p>
        {subtitle && <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium italic">{subtitle}</p>}
    </div>
);

// ── FLEET MANAGER Dashboard ───────────────────────────────────────────
const FleetManagerDash = () => {
    const vehicles = vehicleStore.getAll();
    const trips = tripStore.getAll();
    const maintenanceLogs = maintenanceStore.getAll();
    const fuelLogs = fuelLogStore.getAll();

    const active = vehicles.filter(v => v.status !== 'Retired').length;
    const onTrip = vehicles.filter(v => v.status === 'OnTrip').length;
    const inShop = vehicles.filter(v => v.status === 'InShop').length;
    const available = vehicles.filter(v => v.status === 'Available').length;
    const utilization = active > 0 ? ((onTrip / active) * 100).toFixed(1) : 0;
    const totalFuelCost = fuelLogs.reduce((s, f) => s + (f.cost || 0), 0);
    const totalMaintCost = maintenanceLogs.reduce((s, m) => s + (m.cost || 0), 0);
    const activeTrips = trips.filter(t => t.status === 'Dispatched');

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Fleet" value={vehicles.length} icon={Truck} trend="Active" color="var(--accent-cyan)" subtitle={`${available} available, ${inShop} in shop`} />
                <StatCard title="Utilization Rate" value={`${utilization}%`} icon={Activity} trend={Number(utilization) > 60 ? 'Active' : 'Warning'} color="var(--accent-purple)" subtitle={`${onTrip} vehicles deployed`} />
                <StatCard title="Fuel Spend" value={`$${totalFuelCost.toLocaleString()}`} icon={Fuel} color="var(--accent-yellow)" subtitle={`${fuelLogs.length} log entries`} />
                <StatCard title="Maintenance Cost" value={`$${totalMaintCost.toLocaleString()}`} icon={Wrench} trend={totalMaintCost > 3000 ? 'Critical' : 'Active'} color="var(--accent-teal)" subtitle={`${maintenanceLogs.length} work orders`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Live Trips */}
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[var(--text-primary)] font-bold flex items-center gap-2"><Navigation2 size={16} className="text-[var(--accent-cyan)]" /> Active Trips</h3>
                        <Link to="/trips" className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] opacity-80 hover:opacity-100">View All →</Link>
                    </div>
                    {activeTrips.length === 0 ? (
                        <p className="text-[var(--text-muted)] text-sm">No active trips</p>
                    ) : activeTrips.slice(0, 4).map(trip => (
                        <div key={trip._id} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
                            <div>
                                <p className="text-sm text-[var(--text-primary)] font-medium">{trip.vehicleName || 'Vehicle'}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{trip.source} → {trip.destination}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-[var(--text-muted)]">{trip.driverName || 'Driver'}</p>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] font-bold">{trip.cargoWeight}kg</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fleet Status Breakdown */}
                <div className="glass-card">
                    <h3 className="text-[var(--text-primary)] font-bold mb-4 flex items-center gap-2"><Layers size={16} className="text-[var(--accent-purple)]" /> Fleet Status</h3>
                    {[
                        { label: 'Available', count: available, color: 'var(--accent-teal)', pct: vehicles.length ? (available / vehicles.length * 100) : 0 },
                        { label: 'On Trip', count: onTrip, color: 'var(--accent-cyan)', pct: vehicles.length ? (onTrip / vehicles.length * 100) : 0 },
                        { label: 'In Shop', count: inShop, color: 'var(--accent-yellow)', pct: vehicles.length ? (inShop / vehicles.length * 100) : 0 },
                        { label: 'Retired', count: vehicles.filter(v => v.status === 'Retired').length, color: 'var(--text-muted)', pct: vehicles.length ? (vehicles.filter(v => v.status === 'Retired').length / vehicles.length * 100) : 0 },
                    ].map(s => (
                        <div key={s.label} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-[var(--text-secondary)]">{s.label}</span>
                                <span className="text-[var(--text-primary)] font-bold">{s.count}</span>
                            </div>
                            <div className="w-full h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.pct}%`, background: s.color }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// ── DISPATCHER Dashboard ──────────────────────────────────────────────
const DispatcherDash = () => {
    const trips = tripStore.getAll();
    const vehicles = vehicleStore.getAll();
    const drivers = driverStore.getAll();

    const dispatched = trips.filter(t => t.status === 'Dispatched').length;
    const drafts = trips.filter(t => t.status === 'Draft').length;
    const completed = trips.filter(t => t.status === 'Completed').length;
    const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
    const availableDrivers = drivers.filter(d => d.status === 'Available').length;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Active Dispatches" value={dispatched} icon={Navigation2} trend="Active" color="var(--accent-purple)" subtitle="Currently en-route" />
                <StatCard title="Draft Manifests" value={drafts} icon={Boxes} trend={drafts > 3 ? 'Warning' : 'Active'} color="var(--accent-yellow)" subtitle="Awaiting dispatch" />
                <StatCard title="Available Vehicles" value={availableVehicles} icon={Truck} color="var(--accent-cyan)" subtitle={`of ${vehicles.length} total`} />
                <StatCard title="Available Drivers" value={availableDrivers} icon={Users} color="var(--accent-teal)" subtitle={`of ${drivers.length} total`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Dispatches */}
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[var(--text-primary)] font-bold flex items-center gap-2"><Navigation2 size={16} className="text-[var(--accent-purple)]" /> Recent Dispatches</h3>
                        <Link to="/trips" className="text-xs text-[var(--accent-purple)] hover:text-[var(--accent-purple)] opacity-80 hover:opacity-100">Manage →</Link>
                    </div>
                    {trips.filter(t => t.status === 'Dispatched').slice(0, 5).map(trip => (
                        <div key={trip._id} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
                            <div className="flex items-center gap-3">
                                <MapPin size={14} className="text-[var(--accent-purple)]" />
                                <div>
                                    <p className="text-sm text-[var(--text-primary)] font-medium">{trip.source} → {trip.destination}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{trip.vehicleName} • {trip.driverName}</p>
                                </div>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] font-bold">{trip.cargoWeight}kg</span>
                        </div>
                    ))}
                    {trips.filter(t => t.status === 'Dispatched').length === 0 && (
                        <p className="text-[var(--text-muted)] text-sm">No active dispatches</p>
                    )}
                </div>

                {/* Trip Summary */}
                <div className="glass-card">
                    <h3 className="text-[var(--text-primary)] font-bold mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-[var(--accent-cyan)]" /> Trip Summary</h3>
                    {[
                        { label: 'Dispatched', count: dispatched, color: 'var(--accent-purple)', icon: Navigation2 },
                        { label: 'Draft', count: drafts, color: 'var(--accent-yellow)', icon: Boxes },
                        { label: 'Completed', count: completed, color: 'var(--accent-teal)', icon: CheckCircle2 },
                        { label: 'Cancelled', count: trips.filter(t => t.status === 'Cancelled').length, color: 'var(--accent-red)', icon: XCircle },
                    ].map(s => (
                        <div key={s.label} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
                            <div className="flex items-center gap-3">
                                <s.icon size={16} style={{ color: s.color }} />
                                <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
                            </div>
                            <span className="text-lg font-black text-[var(--text-primary)]">{s.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// ── SAFETY OFFICER Dashboard ──────────────────────────────────────────
const SafetyOfficerDash = () => {
    const drivers = driverStore.getAll();

    const avgSafety = drivers.length > 0 ? (drivers.reduce((s, d) => s + (d.safetyScore || 0), 0) / drivers.length).toFixed(1) : 0;
    const lowScoreDrivers = drivers.filter(d => (d.safetyScore || 0) < 70);
    const expiredLicenses = drivers.filter(d => d.licenseExpiry && new Date(d.licenseExpiry) < new Date());
    const expiringLicenses = drivers.filter(d => {
        if (!d.licenseExpiry) return false;
        const exp = new Date(d.licenseExpiry);
        const now = new Date();
        const sixMonths = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
        return exp >= now && exp <= sixMonths;
    });

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Avg Safety Score" value={avgSafety} icon={ShieldAlert} trend={Number(avgSafety) > 80 ? 'Active' : 'Warning'} color="var(--accent-yellow)" subtitle={`Across ${drivers.length} drivers`} />
                <StatCard title="At-Risk Drivers" value={lowScoreDrivers.length} icon={AlertTriangle} trend={lowScoreDrivers.length > 0 ? 'Critical' : 'Active'} color="var(--accent-red)" subtitle="Safety score below 70" />
                <StatCard title="Expired Licenses" value={expiredLicenses.length} icon={XCircle} trend={expiredLicenses.length > 0 ? 'Critical' : 'Active'} color="var(--accent-red)" subtitle="Immediate action required" />
                <StatCard title="Expiring Soon" value={expiringLicenses.length} icon={Clock} trend={expiringLicenses.length > 0 ? 'Warning' : 'Active'} color="var(--accent-yellow)" subtitle="Within 6 months" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Driver Safety Scores */}
                <div className="glass-card">
                    <h3 className="text-[var(--text-primary)] font-bold mb-4 flex items-center gap-2"><ShieldAlert size={16} className="text-[var(--accent-yellow)]" /> Driver Safety Scores</h3>
                    {drivers.sort((a, b) => (a.safetyScore || 0) - (b.safetyScore || 0)).map(driver => {
                        const score = driver.safetyScore || 0;
                        const color = score >= 90 ? 'var(--accent-teal)' : score >= 70 ? 'var(--accent-yellow)' : 'var(--accent-red)';
                        return (
                            <div key={driver._id} className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[var(--text-secondary)]">{driver.name}</span>
                                    <span className="font-bold" style={{ color }}>{score}</span>
                                </div>
                                <div className="w-full h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: color }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* License Alerts */}
                <div className="glass-card">
                    <h3 className="text-[var(--text-primary)] font-bold mb-4 flex items-center gap-2"><BadgeCheck size={16} className="text-[var(--accent-red)]" /> License Compliance</h3>
                    {drivers.map(driver => {
                        const expired = driver.licenseExpiry && new Date(driver.licenseExpiry) < new Date();
                        const exp = driver.licenseExpiry ? new Date(driver.licenseExpiry) : null;
                        const sixMonths = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
                        const expiringSoon = exp && !expired && exp <= sixMonths;
                        const statusColor = expired ? 'var(--accent-red)' : expiringSoon ? 'var(--accent-yellow)' : 'var(--accent-teal)';
                        const statusLabel = expired ? 'EXPIRED' : expiringSoon ? 'EXPIRING' : 'VALID';
                        return (
                            <div key={driver._id} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
                                <div>
                                    <p className="text-sm text-[var(--text-primary)] font-medium">{driver.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{driver.licenseNumber} • Exp: {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest" style={{ background: `${statusColor}15`, color: statusColor }}>{statusLabel}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

// ── FINANCIAL ANALYST Dashboard ───────────────────────────────────────
const FinancialAnalystDash = () => {
    const fuelLogs = fuelLogStore.getAll();
    const maintenanceLogs = maintenanceStore.getAll();
    const vehicles = vehicleStore.getAll();

    const totalFuelCost = fuelLogs.reduce((s, f) => s + (f.cost || 0), 0);
    const totalMaintCost = maintenanceLogs.reduce((s, m) => s + (m.cost || 0), 0);
    const totalOpCost = totalFuelCost + totalMaintCost;
    const avgFuelPerVehicle = vehicles.length > 0 ? (totalFuelCost / vehicles.length).toFixed(0) : 0;

    // ROI: maintenance cost vs fleet value estimate
    const fleetValue = vehicles.reduce((s, v) => s + (v.odometer > 50000 ? 30000 : 60000), 0);
    const maintROI = fleetValue > 0 ? ((totalMaintCost / fleetValue) * 100).toFixed(2) : 0;

    // Cost per vehicle
    const costByVehicle = vehicles.map(v => {
        const vFuel = fuelLogs.filter(f => f.vehicleId === v._id).reduce((s, f) => s + (f.cost || 0), 0);
        const vMaint = maintenanceLogs.filter(m => m.vehicleId === v._id).reduce((s, m) => s + (m.cost || 0), 0);
        return { ...v, totalCost: vFuel + vMaint, fuelCost: vFuel, maintCost: vMaint };
    }).sort((a, b) => b.totalCost - a.totalCost);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Fuel Spend" value={`$${totalFuelCost.toLocaleString()}`} icon={Fuel} color="var(--accent-yellow)" subtitle={`${fuelLogs.length} transactions`} />
                <StatCard title="Total Maintenance" value={`$${totalMaintCost.toLocaleString()}`} icon={Wrench} color="var(--accent-cyan)" subtitle={`${maintenanceLogs.length} work orders`} />
                <StatCard title="Total Operational Cost" value={`$${totalOpCost.toLocaleString()}`} icon={DollarSign} trend={totalOpCost > 5000 ? 'Warning' : 'Active'} color="var(--accent-purple)" subtitle="Fuel + Maintenance" />
                <StatCard title="Maintenance ROI" value={`${maintROI}%`} icon={TrendingUp} color="var(--accent-teal)" subtitle="Cost vs Fleet Value" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Cost Per Vehicle */}
                <div className="glass-card">
                    <h3 className="text-[var(--text-primary)] font-bold mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-[var(--accent-purple)]" /> Cost Per Vehicle</h3>
                    {costByVehicle.map(v => (
                        <div key={v._id} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-[var(--text-secondary)]">{v.make} {v.model} <span className="text-[var(--text-muted)]">({v.licensePlate})</span></span>
                                <span className="text-[var(--text-primary)] font-bold">${v.totalCost.toLocaleString()}</span>
                            </div>
                            <div className="flex gap-1 text-[10px]">
                                <span className="text-[var(--accent-yellow)]">Fuel: ${v.fuelCost}</span>
                                <span className="text-[var(--text-muted)]">|</span>
                                <span className="text-[var(--accent-cyan)]">Maint: ${v.maintCost}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Fuel Logs */}
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[var(--text-primary)] font-bold flex items-center gap-2"><Fuel size={16} className="text-[var(--accent-yellow)]" /> Recent Fuel Logs</h3>
                        <Link to="/fuel" className="text-xs text-[var(--accent-yellow)] hover:text-[var(--accent-yellow)] opacity-80 hover:opacity-100">View All →</Link>
                    </div>
                    {fuelLogs.slice(0, 5).map(log => (
                        <div key={log._id} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
                            <div>
                                <p className="text-sm text-[var(--text-primary)] font-medium">{log.vehicleName || 'Vehicle'}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{log.liters}L • {new Date(log.date).toLocaleDateString()}</p>
                            </div>
                            <span className="text-sm font-bold text-[var(--accent-yellow)]">${log.cost}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// ── MAIN DASHBOARD ────────────────────────────────────────────────────
const ROLE_TITLES = {
    'Fleet Manager': 'Fleet Command Center',
    'Dispatcher': 'Dispatch Control',
    'Safety Officer': 'Safety & Compliance',
    'Financial Analyst': 'Financial Overview',
};

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const title = ROLE_TITLES[user.role] || 'Dashboard';

    const renderDashboard = () => {
        switch (user.role) {
            case 'Fleet Manager': return <FleetManagerDash />;
            case 'Dispatcher': return <DispatcherDash />;
            case 'Safety Officer': return <SafetyOfficerDash />;
            case 'Financial Analyst': return <FinancialAnalystDash />;
            default: return <FleetManagerDash />;
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{title}</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">Welcome back, {user.name || 'User'}</p>
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;

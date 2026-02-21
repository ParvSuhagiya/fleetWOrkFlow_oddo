import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Login from './pages/Login';

// Role → allowed page paths
const ROLE_ACCESS = {
  'Fleet Manager': ['/', '/vehicles', '/drivers', '/trips', '/maintenance', '/fuel'],
  'Dispatcher': ['/', '/vehicles', '/drivers', '/trips'],
  'Safety Officer': ['/', '/drivers'],
  'Financial Analyst': ['/', '/maintenance', '/fuel'],
};

const getUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    // Ensure user exists and has a valid role
    if (user && user.role && ROLE_ACCESS[user.role]) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ path, children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  const allowed = ROLE_ACCESS[user.role] || ['/'];
  if (!allowed.includes(path)) return <Navigate to="/" replace />;
  return children;
};

const ProtectedLayout = () => {
  const user = getUser();
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-scroll">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<ProtectedRoute path="/vehicles"><Vehicles /></ProtectedRoute>} />
            <Route path="/drivers" element={<ProtectedRoute path="/drivers"><Drivers /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute path="/trips"><Trips /></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute path="/maintenance"><Maintenance /></ProtectedRoute>} />
            <Route path="/fuel" element={<ProtectedRoute path="/fuel"><Fuel /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  </BrowserRouter>
);

export default App;

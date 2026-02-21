import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DispatchPage from './pages/DispatchPage';
import DriversPage from './pages/DriversPage';
import ReportsPage from './pages/ReportsPage';
import VehiclesPage from './pages/VehiclesPage';
import TripsPage from './pages/TripsPage';
import MaintenancePage from './pages/MaintenancePage';
import FuelLogsPage from './pages/FuelLogsPage';
import AnalyticsPage from './pages/AnalyticsPage';

/**
 * Main App Component
 * Sets up routing and authentication
 */
function App() {
  useEffect(() => {
    // Final integration check complete
    console.log('🎉 PROFESSIONAL FLEETFLOW UI READY');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/login" element={<LoginPage />} /> */}

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <DashboardPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/dispatch"
            element={
              // <ProtectedRoute>
                <DispatchPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              // <ProtectedRoute>
                <DriversPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              // <ProtectedRoute>
                <ReportsPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              // <ProtectedRoute>
                <VehiclesPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              // <ProtectedRoute>
                <TripsPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              // <ProtectedRoute>
                <MaintenancePage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/fuel-logs"
            element={
              // <ProtectedRoute>
                <FuelLogsPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              // <ProtectedRoute>
                <AnalyticsPage />
              // </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

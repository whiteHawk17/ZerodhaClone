import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Holdings from './components/Holdings';
import Orders from './components/Orders';
import Positions from './components/Positions';
import Funds from './components/Funds';
import Summary from './components/Summary';
import Apps from './components/Apps';
import TopBar from './components/TopBar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    // Redirect to the frontend login page
    window.location.replace('http://localhost:3000/login');
    return null; // Return null to prevent further rendering of this component
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-1">
        <DashboardLayout>{children}</DashboardLayout>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/holdings"
            element={
              <ProtectedRoute>
                <Holdings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/positions"
            element={
              <ProtectedRoute>
                <Positions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/funds"
            element={
              <ProtectedRoute>
                <Funds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <Summary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apps"
            element={
              <ProtectedRoute>
                <Apps />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 
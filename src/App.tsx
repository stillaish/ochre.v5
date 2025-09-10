import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WeatherProvider } from './contexts/WeatherContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ReportHazard from './pages/ReportHazard';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import EmergencyContacts from './components/EmergencyContacts';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationDisplay from './components/NotificationDisplay';

function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="pb-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/report" element={
                    <ProtectedRoute>
                      <ReportHazard />
                    </ProtectedRoute>
                  } />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <EmergencyContacts />
              <NotificationDisplay />
            </div>
          </Router>
        </NotificationProvider>
      </WeatherProvider>
    </AuthProvider>
  );
}

export default App;
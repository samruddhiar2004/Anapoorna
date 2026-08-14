import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { CreateDonation } from './pages/CreateDonation';
import { NgoDashboard } from './pages/NgoDashboard';
import { NearbyDonations } from './pages/NearbyDonations';
import { RouteOptimizer } from './pages/RouteOptimizer';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Donor Routes */}
              <Route path="/donor-dashboard" element={
                <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
                  <DonorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/create-donation" element={
                <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
                  <CreateDonation />
                </ProtectedRoute>
              } />

              {/* NGO / Receiver / Volunteer Routes */}
              <Route path="/ngo-dashboard" element={
                <ProtectedRoute allowedRoles={['NGO', 'VOLUNTEER', 'ADMIN']}>
                  <NgoDashboard />
                </ProtectedRoute>
              } />
              <Route path="/nearby-donations" element={
                <ProtectedRoute allowedRoles={['NGO', 'VOLUNTEER', 'ADMIN']}>
                  <NearbyDonations />
                </ProtectedRoute>
              } />
              <Route path="/route-optimizer" element={
                <ProtectedRoute allowedRoles={['NGO', 'VOLUNTEER', 'ADMIN']}>
                  <RouteOptimizer />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

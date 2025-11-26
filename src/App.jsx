import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewCard from './pages/NewCard';
import MyCards from './pages/MyCards';
import DigitalTwin from './pages/DigitalTwin';
import MarketIntel from './pages/MarketIntel';
import ViewCard from './pages/ViewCard';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { currentUser, userProfile, isAdmin, isFarmer } = useAuth();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/view-card" element={<ViewCard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Dashboard Routes - Role Based */}
        <Route path="/" element={
          isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
        } />
        <Route path="/dashboard" element={
          isFarmer ? <FarmerDashboard /> : <Navigate to="/admin" />
        } />
        <Route path="/admin" element={
          isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />
        } />

        {/* Common Routes */}
        <Route path="/new-card" element={<NewCard />} />
        <Route path="/cards" element={<MyCards />} />
        <Route path="/digital-twin" element={<DigitalTwin />} />
        <Route path="/market-intel" element={<MarketIntel />} />
        <Route path="/view-card" element={<ViewCard />} />
        <Route path="/login" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

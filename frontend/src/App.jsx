import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Fungsi sederhana untuk mengecek apakah user sudah punya token login
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Komponen pelindung agar dashboard tidak bisa diakses tanpa login
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Halaman Login (Halaman Utama) */}
        <Route path="/" element={<Login />} />
        
        {/* Rute Halaman Dashboard (Dilindungi) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
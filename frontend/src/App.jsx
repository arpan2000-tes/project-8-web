import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // Pastikan path import sesuai dengan struktur folder Anda
import SignUp from './pages/SignUp';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';

// Komponen Proteksi Rute (hanya bisa diakses jika sudah ada token)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman Autentikasi */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verifyOTP" element={<VerifyOTP />} />

        {/* Rute untuk halaman Dashboard dengan Proteksi */}
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
};

export default App;
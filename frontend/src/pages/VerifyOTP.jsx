import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60); // Timer mundur 60 detik untuk resend
  const navigate = useNavigate();

  // Effect untuk timer mundur
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const savedEmail = localStorage.getItem('email');
      
      if (!savedEmail) {
        throw new Error('Sesi tidak ditemukan. Silakan login atau daftar kembali.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/verifyOTP', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': import.meta.env.VITE_API_KEY,
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          email: savedEmail, 
          otp_code: otp 
        }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Kode OTP salah atau kadaluarsa.');
      }

      alert('Verifikasi Berhasil! Akun kamu sudah aktif.');
      navigate('/dashboard'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI UNTUK KIRIM ULANG OTP
  const handleResendOTP = async () => {
    if (timer > 0) return;
    
    setError('');
    setSuccessMsg('');
    setResendLoading(true);

    try {
      const savedEmail = localStorage.getItem('email');
      if (!savedEmail) {
        throw new Error('Email tidak ditemukan. Silakan daftar kembali.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/resendOTP', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ email: savedEmail }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Gagal mengirim ulang OTP.');
      }

      setSuccessMsg('Kode OTP baru berhasil dikirim ke email kamu!');
      setTimer(60); // Reset timer ke 60 detik
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Verifikasi OTP</h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Masukkan 6 digit kode yang telah dikirimkan ke email kamu.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <input
              id="otp" 
              type="text" 
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) setOtp(value);
              }}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••" 
              required
            />
          </div>

          <button
            type="submit" 
            disabled={loading || otp.length < 6}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi Akun'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum menerima kode?{' '}
          <button 
            type="button"
            onClick={handleResendOTP}
            disabled={timer > 0 || resendLoading}
            className="text-blue-600 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {resendLoading 
              ? 'Mengirim...' 
              : timer > 0 
                ? `Kirim ulang (${timer}s)` 
                : 'Kirim ulang'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
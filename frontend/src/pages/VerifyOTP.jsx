import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const savedEmail = localStorage.getItem('email'); // AMBIL EMAIL DARI STORAGE
      
      if (!token || !savedEmail) {
        throw new Error('Sesi tidak ditemukan. Silakan login atau daftar kembali.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/verifyOTP', { // Pastikan huruf besar-kecil endpoint cocok
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY' : import.meta.env.VITE_API_KEY,
          'Authorization': `Bearer ${token}` 
        },
        // SESUAIKAN DENGAN SKEMA BACKEND (VerifyOTPSchema)
        body: JSON.stringify({ 
            email: savedEmail, 
            otp_code: otp 
        }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Kode OTP salah atau kadaluarsa. Silakan coba lagi.');
      }

      alert('Verifikasi Berhasil! Akun kamu sudah aktif.');
      
      // Jika berhasil verifikasi, baru pindahkan user ke dashboard
      navigate('/dashboard'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <input
              id="otp" 
              type="text" 
              value={otp}
              onChange={(e) => {
                // Memastikan hanya angka yang bisa diinput dan maksimal 6 digit (standar PyOTP)
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) setOtp(value);
              }}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••" 
              required
            />
          </div>

          <button
            type="submit" 
            disabled={loading || otp.length < 6}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi Akun'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Belum menerima kode? <button className="text-blue-600 hover:underline">Kirim ulang</button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Alat untuk pindah halaman

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          // Simpan email ke local storage agar bisa digunakan oleh halaman VerifyOTP
          localStorage.setItem('email', email); 
          
          alert('Akun kamu belum diverifikasi. Mengalihkan ke halaman OTP...');
          navigate('/verifyOTP'); // Pindahkan ke halaman OTP
          return; // Hentikan fungsi sampai di sini agar tidak masuk ke blok throw new Error
        } 
        throw new Error(data.detail || 'Login gagal, periksa email dan password.');
      }

      localStorage.setItem('token', data.token);
      alert('Login Berhasil! Mengalihkan ke Dashboard...');
      
      // Pindah ke halaman dashboard
      navigate('/dashboard'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... SISA KODE RETURN SAMA PERSIS DENGAN KODE KAMU SEBELUMNYA ...
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Masukkan email" required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Masukkan password" required
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Memproses...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun? <a href="/signup" className="text-blue-600 hover:underline">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
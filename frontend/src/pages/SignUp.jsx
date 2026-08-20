import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mengarah ke endpoint signup di backend FastAPI
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          
         },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Menangkap error dari backend seperti "email already registered"
        throw new Error(data.detail || 'Registrasi gagal, silakan coba lagi.');
      }

      // Backend mengembalikan token saat berhasil signup
      // Jika backend me-return token secara langsung, gunakan data, jika berupa object gunakan data.token
      const token = typeof data === 'string' ? data : data.token;
      
      localStorage.setItem('token', token);
      localStorage.setItem('email', email); // SIMPAN EMAIL JUGA UNTUK VERIFIKASI NANTI
      alert('Registrasi Berhasil! Silakan periksa email untuk kode OTP....');
      
      // Langsung pindah ke halaman dashboard
      navigate('/VerifyOTP'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Masukkan nama lengkap" required
            />
          </div>

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
              placeholder="Buat password" required
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Memproses...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun? <a href="/" className="text-blue-600 hover:underline">Sign In di sini</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
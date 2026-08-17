import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialProducts = [
  { id: 1, name: "Kopi Hitam", category: "minuman", price: 12000, icon: "☕" },
  { id: 2, name: "Es Teh Manis", category: "minuman", price: 5000, icon: "🥤" },
  { id: 3, name: "Nasi Goreng", category: "makanan", price: 20000, icon: "🍳" },
  { id: 4, name: "Mie Goreng", category: "makanan", price: 18000, icon: "🍜" },
  { id: 5, name: "Roti Bakar", category: "makanan", price: 15000, icon: "🍞" },
  { id: 6, name: "Air Mineral", category: "minuman", price: 4000, icon: "💧" }
];

const Dashboard = () => {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Logika Filter Produk
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Logika Tambah Keranjang
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  // Logika Ubah Qty Keranjang
  const changeQty = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.id === productId) {
          return { ...item, qty: item.qty + delta };
        }
        return item;
      }).filter(item => item.qty > 0);
    });
  };

  // Logika Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Anda telah logout');
    navigate('/');
  };

  // Logika Checkout
  const processCheckout = () => {
    if (cart.length === 0) {
      alert("Pilih minimal satu produk sebelum memproses pembayaran!");
      return;
    }
    // Nanti kirim data keranjang (cart) via fetch ke FastAPI di sini
    alert(`Transaksi Berhasil!`);
    setCart([]); // Kosongkan keranjang
  };

  // Kalkulasi Total
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-100 font-sans h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold tracking-wide">🛒 Kasir POS App</h1>
          <span className="bg-indigo-700 text-xs px-2 py-1 rounded-full text-indigo-200">v1.0 React</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-semibold">Kasir: Demo User</p>
            <p className="text-xs text-indigo-200">Shift Pagi</p>
          </div>
          <button onClick={handleLogout} className="bg-indigo-800 hover:bg-indigo-900 text-xs px-3 py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Kolom Kiri: Katalog */}
        <main className="w-2/3 p-6 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center mb-6 gap-4">
            <input 
              type="text" 
              placeholder="Cari nama barang..." 
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)} 
                className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
              >
                <div className="text-3xl mb-2 text-center">{product.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                </div>
                <p className="text-indigo-600 font-bold text-sm mt-2">Rp {product.price.toLocaleString("id-ID")}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Kolom Kanan: Keranjang */}
        <aside className="w-1/3 bg-white border-l border-gray-200 flex flex-col shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Pesanan Saat Ini</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400 my-10 text-sm">Keranjang masih kosong</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">{item.name}</h4>
                    <p className="text-xs text-gray-500">Rp {item.price.toLocaleString("id-ID")} x {item.qty}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs font-bold">-</button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs font-bold">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ringkasan */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Pajak (11%)</span>
              <span className="font-semibold">Rp {Math.round(tax).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-indigo-600">Rp {Math.round(total).toLocaleString("id-ID")}</span>
            </div>
            <button 
              onClick={processCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200"
            >
              Proses Pembayaran
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;
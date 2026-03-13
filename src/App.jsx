import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Delivery from './pages/Delivery';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Loss from './pages/Loss';
import { initDb } from './services/db';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDb();
        setDbReady(true);
      } catch (err) {
        console.error("Database initialization failed", err);
      }
    };
    setup();
  }, []);

  if (!dbReady) return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="font-black text-primary-600 animate-pulse text-2xl">
        جارٍ التحميل...
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/loss" element={<Loss />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

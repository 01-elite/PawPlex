import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Registration from './components/Registration';
import ProductsList from './components/ProductsList';
import AdminAddProduct from './components/AdminAddProduct';
import StockPage from './components/StockPage';

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: 20 }}>
        <Link to="/" style={{ marginRight: 10 }}>Home</Link>
        <Link to="/register" style={{ marginRight: 10 }}>Register</Link>
        <Link to="/products" style={{ marginRight: 10 }}>Buy</Link>
        <Link to="/admin/add">Admin Add</Link>
        <Link to="/stock" style={{ marginLeft: 10 }}>Stock</Link>
      </header>
      <Routes>
        <Route path="/" element={<h2>Welcome to Pet Store Inventory Manager</h2>} />
        <Route path="/register" element={<Registration />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/admin/add" element={<AdminAddProduct />} />
        <Route path="/stock" element={<StockPage />} />
      </Routes>
    </div>
  );
}

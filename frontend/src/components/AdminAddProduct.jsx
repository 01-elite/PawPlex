import React, { useState } from 'react';
import { apiPost } from '../api';

export default function AdminAddProduct() {
  const [form, setForm] = useState({ name:'', category:'food', price:0, stock:0, description:'' });
  const [msg, setMsg] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
      setMsg('Product added: ' + res._id);
      setForm({ name:'', category:'food', price:0, stock:0, description:'' });
    } catch (err) {
      setMsg('Error: ' + err.message);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 600 }}>
        <h3>Admin - Add Product</h3>
        <form onSubmit={submit}>
          <div><input name="name" value={form.name} onChange={change} placeholder="Name" required /></div>
          <div>
            <select name="category" value={form.category} onChange={change}>
              <option value="food">Food</option>
              <option value="pet">Pet item</option>
            </select>
          </div>
          <div><input name="price" type="number" value={form.price} onChange={change} placeholder="Price" required /></div>
          <div><input name="stock" type="number" value={form.stock} onChange={change} placeholder="Stock" required /></div>
          <div><textarea name="description" value={form.description} onChange={change} placeholder="Description"/></div>
          <button type="submit">Add</button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

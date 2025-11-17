import React, { useState } from 'react';
import { apiPost } from '../api';

export default function Registration() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [msg, setMsg] = useState('');
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('/users', form);
      setMsg('Registration successful! ID: ' + res._id);
      setForm({ name: '', email: '', phone: '', address: '' });
    } catch (err) {
      setMsg('Error: ' + err.message);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 600 }}>
        <h3>Register</h3>
        <form onSubmit={submit}>
          <div><input name="name" placeholder="Name" value={form.name} onChange={handle} required /></div>
          <div><input name="email" placeholder="Email" value={form.email} onChange={handle} required /></div>
          <div><input name="phone" placeholder="Phone" value={form.phone} onChange={handle} /></div>
          <div><input name="address" placeholder="Address" value={form.address} onChange={handle} /></div>
          <button type="submit">Register</button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

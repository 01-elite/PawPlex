import React, { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../api';

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiGet('/products').then(setProducts).catch(e => setMsg(e.message));
  }, []);

  const updateStock = async (id) => {
    const newStock = prompt('Enter new stock');
    if (newStock === null) return;
    try {
      await apiPatch(`/products/${id}/stock`, { stock: Number(newStock) });
      const p = await apiGet('/products');
      setProducts(p);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="container">
      <h3>Stock</h3>
      {products.map(p => (
        <div key={p._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{p.name}</strong>
            <div>stock: {p.stock} — price: ₹{p.price}</div>
          </div>
          <div>
            <button onClick={() => updateStock(p._id)}>Update stock</button>
          </div>
        </div>
      ))}
      {msg && <p>{msg}</p>}
    </div>
  );
}

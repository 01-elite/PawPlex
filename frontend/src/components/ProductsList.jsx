import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(''); // require registered user id
  const [cart, setCart] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiGet('/products').then(setProducts).catch(err => setMsg(err.message));
  }, []);

  const changeQty = (id, delta) => {
    setCart(prev => {
      const cur = prev[id] || 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [id]: next };
    });
  };

  const buy = async () => {
    if (!userId) return setMsg('Enter your User ID from registration');
    const items = Object.entries(cart).filter(([_,v]) => v>0).map(([productId, qty]) => ({ productId, qty }));
    if (items.length === 0) return setMsg('Cart empty');
    try {
      const res = await apiPost('/orders', { userId, items });
      setMsg('Order placed! ID: ' + res._id);
      // refresh products (stock changed)
      const p = await apiGet('/products');
      setProducts(p);
      setCart({});
    } catch (err) {
      setMsg('Error: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h3>Products</h3>
      <div className="card">
        <div style={{ marginBottom: 8 }}>
          <label>User ID (from registration): <input value={userId} onChange={e=>setUserId(e.target.value)} /></label>
        </div>
        {products.map(p => (
          <div key={p._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{p.name}</strong><div style={{ fontSize: 13 }}>{p.description}</div>
              <div>₹{p.price} — stock: {p.stock}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={()=>changeQty(p._id, -1)}>-</button>
                <span style={{ padding: '0 8px' }}>{cart[p._id] || 0}</span>
                <button onClick={()=>changeQty(p._id, 1)}>+</button>
              </div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12 }}>
          <button onClick={buy}>Buy</button>
        </div>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

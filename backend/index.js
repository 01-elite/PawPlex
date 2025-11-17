require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/petstoredb';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- Users ---
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, address, isAdmin } = req.body;
    const user = new User({ name, email, phone, address, isAdmin: !!isAdmin });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});
app.get('/api/users', async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// --- Products ---
app.get('/api/products', async (req, res) => {
  try {
    const q = {};
    if (req.query.category) q.category = req.query.category;
    if (req.query.search) q.name = { $regex: req.query.search, $options: 'i' };
    const products = await Product.find(q).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, stock, description, image } = req.body;
    const p = new Product({ name, category, price, stock, description, image });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update stock (admin)
app.patch('/api/products/:id/stock', async (req, res) => {
  try {
    const { stock } = req.body;
    const p = await Product.findByIdAndUpdate(req.params.id, { $set: { stock } }, { new: true });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Orders (purchase) ---
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items } = req.body; // items: [{productId, qty}]
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const populatedItems = [];
    let total = 0;
    for (const it of items) {
      const prod = await Product.findById(it.productId);
      if (!prod) return res.status(400).json({ error: `Product ${it.productId} not found` });
      if (prod.stock < it.qty) return res.status(400).json({ error: `Insufficient stock for ${prod.name}` });

      // reduce stock
      prod.stock -= it.qty;
      await prod.save();

      populatedItems.push({ product: prod._id, qty: it.qty, price: prod.price });
      total += prod.price * it.qty;
    }

    const order = new Order({ user: user._id, items: populatedItems, total });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get orders (admin)
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.product').sort({ createdAt: -1 });
  res.json(orders);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

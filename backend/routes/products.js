const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middlewares/auth');

// list all
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// get single
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

// admin add product
router.post('/', auth, adminOnly, async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  try {
    const p = new Product({ name, description, price, stock, category, createdBy: req.user._id });
    await p.save();
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// admin update stock or details
router.put('/:id', auth, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// delete (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;

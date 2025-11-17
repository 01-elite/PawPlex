const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');

// Create purchase
router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }

    product.stock -= quantity;
    await product.save();

    const purchase = new Purchase({
      user: req.user._id,
      product: productId,
      quantity,
      total: product.price * quantity
    });

    await purchase.save();

    res.json({ purchase, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get purchases of logged-in user
router.get('/me', auth, async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id }).populate('product');
  res.json(purchases);
});

module.exports = router;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String, // 'food' or 'pet'
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

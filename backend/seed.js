require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/petstoredb';
mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB for seeding');
  await Product.deleteMany({});
  await User.deleteMany({});

  await User.create({ name: 'Test User', email: 'test@example.com', phone: '9999999999', address: 'Somewhere' });

  const products = [
    { name: 'Dog Food - Chicken 1kg', category: 'food', price: 500, stock: 20, description: 'Chicken flavored dog food' },
    { name: 'Cat Food - Fish 500g', category: 'food', price: 250, stock: 30, description: 'Fish flavored cat food' },
    { name: 'Dog Toy - Squeaky', category: 'pet', price: 199, stock: 50, description: 'Rubber squeaky toy' }
  ];
  await Product.insertMany(products);
  console.log('Seeded products and user');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

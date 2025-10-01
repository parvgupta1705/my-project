const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Route to seed sample products
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = [
      {
        name: 'Solar-Powered Lantern',
        price: 49.99,
        category: 'Outdoor Gear',
        description: 'Eco-friendly lantern with long-lasting solar battery.',
        variants: [
          { color: 'Green', size: 'Medium', stock: 20 },
          { color: 'Yellow', size: 'Medium', stock: 12 },
          { color: 'Blue', size: 'Medium', stock: 8 }
        ]
      },
      {
        name: 'Wireless Noise-Canceling Earbuds',
        price: 129.95,
        category: 'Audio Devices',
        description: 'Immersive sound with crystal-clear calls and bass.',
        variants: [
          { color: 'Black', size: 'One Size', stock: 50 },
          { color: 'White', size: 'One Size', stock: 30 }
        ]
      },
      {
        name: 'Organic Cotton Hoodie',
        price: 59.50,
        category: 'Apparel',
        description: 'Soft, breathable hoodie made from 100% organic cotton.',
        variants: [
          { color: 'Olive', size: 'S', stock: 25 },
          { color: 'Olive', size: 'M', stock: 20 },
          { color: 'Gray', size: 'L', stock: 15 }
        ]
      },
      {
        name: 'Smart Fitness Watch',
        price: 199.00,
        category: 'Wearables',
        description: 'Track your health and activity with advanced sensors.',
        variants: [
          { color: 'Silver', size: 'Standard', stock: 35 },
          { color: 'Black', size: 'Standard', stock: 40 }
        ]
      },
      {
        name: 'Portable Espresso Maker',
        price: 89.00,
        category: 'Kitchen Appliances',
        description: 'Brew coffee anywhere with this compact espresso maker.',
        variants: [
          { color: 'Red', size: 'One Size', stock: 18 },
          { color: 'Black', size: 'One Size', stock: 22 }
        ]
      }
    ];

    const insertedProducts = await Product.insertMany(sampleProducts);
    res.status(201).json({ 
      status: 'success', 
      message: `${insertedProducts.length} new products added successfully.` 
    });
  } catch (err) {
    res.status(500).json({ error: `Failed to seed products: ${err.message}` });
  }
});

// Route to fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: `Error fetching products: ${err.message}` });
  }
});

// Route to filter products by category
router.get('/filter', async (req, res) => {
  const { category } = req.query;
  if (!category) return res.status(400).json({ message: 'Please provide a "category" query parameter.' });

  try {
    const filtered = await Product.find({ category }).select('name price category variants');
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: `Filter operation failed: ${err.message}` });
  }
});

// Route to get variants by color
router.get('/variants/:color', async (req, res) => {
  const { color } = req.params;

  try {
    const variants = await Product.aggregate([
      { $unwind: '$variants' },
      { $match: { 'variants.color': { $regex: new RegExp(color, 'i') } } },
      { $project: { _id: 0, product: '$name', price: '$price', variant: '$variants' } }
    ]);

    if (!variants.length) {
      return res.status(404).json({ message: `No variants found for color "${color}".` });
    }

    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: `Aggregation failed: ${err.message}` });
  }
});

module.exports = router;

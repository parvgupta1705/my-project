const express = require('express');
const mongoose = require('mongoose');
const app = express();

const productRoutes = require('./routes/products');

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb')
  .then(() => console.log('[DB] Connected to MongoDB successfully.'))
  .catch(err => console.error(`[DB ERROR] Connection failed: ${err.message}`));

// Use product routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[SERVER] App is running at http://localhost:${PORT}`);
  console.log('Available API Endpoints:');
  console.log(`- Seed Sample Products: POST http://localhost:${PORT}/api/products/seed`);
  console.log(`- Get All Products: GET http://localhost:${PORT}/api/products`);
  console.log(`- Filter Products by Category: GET http://localhost:${PORT}/api/products/filter?category=Apparel`);
  console.log(`- Get Variants by Color: GET http://localhost:${PORT}/api/products/variants/Red`);
});

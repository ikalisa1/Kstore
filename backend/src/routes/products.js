const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get low stock products
router.get('/low-stock', auth, async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$minStock'] }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get product by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create product
router.post('/', auth, async (req, res) => {
  try {
    const { name, sku, category, unitPrice, quantity, minStock, maxStock, supplier, description } = req.body;
    
    // Validate required fields
    if (!name || !sku || !category || !unitPrice || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields: name, sku, category, unitPrice, quantity' });
    }

    const product = new Product({
      name,
      sku,
      category,
      unitPrice: parseFloat(unitPrice),
      quantity: parseFloat(quantity),
      minStock: minStock ? parseFloat(minStock) : 10,
      maxStock: maxStock ? parseFloat(maxStock) : 1000,
      supplier: supplier || '',
      description: description || ''
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product = Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

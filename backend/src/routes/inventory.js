const express = require('express');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get inventory history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await Inventory.find()
      .populate('product', 'name sku')
      .sort({ date: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Record inventory transaction
router.post('/transaction', auth, async (req, res) => {
  try {
    const { productId, quantity, type, reason, notes } = req.body;
    
    // Validate required fields
    if (!productId || quantity === undefined || !type) {
      return res.status(400).json({ message: 'Missing required fields: productId, quantity, type' });
    }
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update product quantity
    if (type === 'in') {
      product.quantity += parseFloat(quantity);
    } else if (type === 'out') {
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.quantity -= parseFloat(quantity);
    } else if (type === 'adjustment') {
      product.quantity = parseFloat(quantity);
    }

    await product.save();

    // Record transaction
    const transaction = new Inventory({
      product: productId,
      quantity: parseFloat(quantity),
      type,
      reason: reason || '',
      notes: notes || ''
    });
    await transaction.save();

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Inventory transaction error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

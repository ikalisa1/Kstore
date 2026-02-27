const express = require('express');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's expenses
    const todayExpenses = await Expense.find({
      date: { $gte: today, $lt: tomorrow }
    });
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$quantity', '$minStock'] }
    });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Total inventory value
    const products = await Product.find();
    const inventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);

    // Recent transactions
    const recentTransactions = await Inventory.find()
      .populate('product', 'name sku')
      .sort({ date: -1 })
      .limit(10);

    res.json({
      todayExpenses: todayTotal,
      lowStockCount: lowStockProducts.length,
      totalProducts,
      inventoryValue,
      recentTransactions
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get monthly analytics
router.get('/monthly', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'month and year parameters are required' });
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lt: endDate }
    });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = {};
    expenses.forEach(exp => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });

    res.json({ total, byCategory, expenses });
  } catch (err) {
    console.error('Monthly analytics error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

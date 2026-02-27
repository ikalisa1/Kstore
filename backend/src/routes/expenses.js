const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// Get daily expenses
router.get('/daily/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const expenses = await Expense.find({
      date: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ date: -1 });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ expenses, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get expenses by date range
router.get('/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await Expense.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ date: -1 });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ expenses, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add new expense
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, description, paymentMethod, date } = req.body;
    
    // Validate required fields
    if (!amount || !category || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields: amount, category, paymentMethod' });
    }

    const expense = new Expense({
      amount: parseFloat(amount),
      category,
      description: description || '',
      paymentMethod,
      date: date ? new Date(date) : new Date()
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error('Expense creation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense = Object.assign(expense, req.body);
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

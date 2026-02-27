const express = require('express');
const fs = require('fs');
const path = require('path');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

const router = express.Router();

// Backup all data
router.post('/create', auth, async (req, res) => {
  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      expenses: await Expense.find(),
      products: await Product.find(),
      inventory: await Inventory.find().populate('product')
    };

    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const fileName = `backup-${Date.now()}.json`;
    const filePath = path.join(backupDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    res.json({ message: 'Backup created successfully', fileName });
  } catch (err) {
    res.status(500).json({ message: 'Backup failed', error: err.message });
  }
});

// List backups
router.get('/list', auth, async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      return res.json({ backups: [] });
    }

    const files = fs.readdirSync(backupDir).map(file => ({
      name: file,
      created: fs.statSync(path.join(backupDir, file)).mtime
    }));

    res.json({ backups: files });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Download backup
router.get('/download/:fileName', auth, (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../backups', req.params.fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Backup not found' });
    }
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

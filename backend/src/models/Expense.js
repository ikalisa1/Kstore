const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

expenseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);

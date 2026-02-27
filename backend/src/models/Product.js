const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  minStock: { type: Number, required: true, default: 10 },
  maxStock: { type: Number, required: true },
  supplier: String,
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);

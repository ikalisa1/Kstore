const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  sku: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  customerName: { type: String, default: 'Guest' },
  customerEmail: { type: String, required: true },
  paymentMethod: { type: String, default: 'Cash' },
  status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
  invoiceNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
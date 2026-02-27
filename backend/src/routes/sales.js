const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const { sendPurchaseNotification, sendLowStockAlert } = require('../utils/emailService');

// Create a new sale/purchase
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, customerEmail, customerName, paymentMethod } = req.body;

    // Validate input
    if (!productId || !quantity || !customerEmail) {
      return res.status(400).json({ 
        error: 'Product ID, quantity, and customer email are required' 
      });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if enough stock is available
    const qty = parseFloat(quantity);
    if (product.quantity < qty) {
      return res.status(400).json({ 
        error: `Insufficient stock. Only ${product.quantity} units available` 
      });
    }

    // Update product quantity
    product.quantity -= qty;
    await product.save();

    const unitPrice = product.unitPrice;
    const totalPrice = unitPrice * qty;

    // Create sale record
    const sale = await Sale.create({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      quantity: qty,
      unitPrice,
      totalPrice,
      customerName: customerName || 'Guest',
      customerEmail,
      paymentMethod: paymentMethod || 'Cash',
      status: 'completed',
      invoiceNumber: `INV-${Date.now()}`
    });

    // Prepare product details for email
    const productDetails = {
      name: product.name,
      description: product.description,
      price: unitPrice,
      quantity: qty,
      customerName: customerName || 'Valued Customer'
    };

    // Send purchase notification email to customer
    const emailResult = await sendPurchaseNotification(customerEmail, productDetails);

    // Check if stock is low and send alert to admin
    if (product.quantity <= product.minStock) {
      await sendLowStockAlert(process.env.ADMIN_EMAIL, {
        name: product.name,
        quantity: product.quantity,
        minStock: product.minStock
      });
    }

    res.status(200).json({
      message: 'Purchase completed successfully',
      sale: {
        id: sale._id,
        invoiceNumber: sale.invoiceNumber,
        productId: product._id,
        productName: product.name,
        quantity: qty,
        unitPrice,
        totalPrice,
        customerEmail: customerEmail,
        customerName: customerName || 'Guest',
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        remainingStock: product.quantity,
        emailSent: emailResult.success,
        emailMessage: emailResult.success 
          ? 'Confirmation email sent successfully!' 
          : `Email failed: ${emailResult.error || 'Please configure email settings'}`,
        timestamp: sale.createdAt
      }
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});

// Get all sales (for reporting)
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

module.exports = router;

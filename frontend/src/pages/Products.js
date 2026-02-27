import React, { useEffect, useState } from 'react';
import { productAPI, inventoryAPI, salesAPI } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseData, setPurchaseData] = useState({
    customerName: '',
    customerEmail: '',
    quantity: 1
  });
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'general',
    unitPrice: '',
    quantity: '',
    minStock: '10',
    maxStock: '100',
    supplier: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock),
        maxStock: parseInt(formData.maxStock)
      };
      console.log('Sending product payload:', payload);
      await productAPI.createProduct(payload);
      setFormData({
        name: '', sku: '', category: 'general', unitPrice: '', quantity: '',
        minStock: '10', maxStock: '100', supplier: '', description: ''
      });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Product creation error:', err.response?.data || err.message);
      alert(`Failed to create product: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error('Product deletion error:', err.response?.data || err.message);
        alert(`Failed to delete product: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleQuantityChange = async (productId, change) => {
    try {
      await inventoryAPI.recordTransaction({
        productId,
        quantity: Math.abs(change),
        type: change > 0 ? 'in' : 'out',
        reason: 'Manual adjustment'
      });
      fetchProducts();
    } catch (err) {
      console.error('Inventory update error:', err.response?.data || err.message);
      alert(`Failed to update quantity: ${err.response?.data?.message || err.message}`);
    }
  };

  const handlePurchaseClick = (product) => {
    setSelectedProduct(product);
    setPurchaseData({ customerName: '', customerEmail: '', quantity: 1 });
    setShowPaymentQR(false);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      const result = await salesAPI.createSale({
        productId: selectedProduct._id,
        quantity: parseInt(purchaseData.quantity),
        customerEmail: purchaseData.customerEmail,
        customerName: purchaseData.customerName
      });
      
      alert(`Purchase successful! ${result.data.emailSent ? 'Confirmation email sent to customer.' : 'Email notification failed.'}`);
      setShowPurchaseModal(false);
      setShowPaymentQR(false);
      fetchProducts(); // Refresh to show updated stock
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process purchase');
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return (
      product.name?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.supplier?.toLowerCase().includes(query)
    );
  });

  const handlePrintProducts = () => {
    window.print();
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products Management</h1>
        <div className="products-header-actions">
          <button className="btn" onClick={handlePrintProducts}>
            Print Products
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      <div className="products-controls">
        <input
          type="text"
          className="products-search"
          placeholder="Search by name, SKU, category, or supplier"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="products-count">Showing {filteredProducts.length} of {products.length}</span>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => { setShowPurchaseModal(false); setShowPaymentQR(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Purchase Product</h2>
              <button className="close-btn" onClick={() => { setShowPurchaseModal(false); setShowPaymentQR(false); }}>×</button>
            </div>
            
            {!showPaymentQR ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setShowPaymentQR(true);
              }}>
                <div className="purchase-info">
                  <h3>{selectedProduct.name}</h3>
                  <p>Price: ${selectedProduct.unitPrice.toFixed(2)}</p>
                  <p>Available Stock: {selectedProduct.quantity}</p>
                </div>
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={purchaseData.customerName}
                    onChange={(e) => setPurchaseData({ ...purchaseData, customerName: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="form-group">
                  <label>Customer Email *</label>
                  <input
                    type="email"
                    value={purchaseData.customerEmail}
                    onChange={(e) => setPurchaseData({ ...purchaseData, customerEmail: e.target.value })}
                    required
                    placeholder="customer@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.quantity}
                    value={purchaseData.quantity}
                    onChange={(e) => setPurchaseData({ ...purchaseData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="total-price">
                  <strong>Total: ${(selectedProduct.unitPrice * purchaseData.quantity).toFixed(2)}</strong>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn" onClick={() => setShowPurchaseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Proceed to Payment
                  </button>
                </div>
              </form>
            ) : (
              <div className="payment-qr-section">
                <div className="qr-payment-info">
                  <h3>📱 Scan to Pay</h3>
                  <p className="payment-amount">Total: <strong>${(selectedProduct.unitPrice * purchaseData.quantity).toFixed(2)}</strong></p>
                  <p className="payment-reference">Reference: {selectedProduct.name} x{purchaseData.quantity}</p>
                </div>
                
                <div className="qr-code-container">
                  <QRCodeSVG 
                    value={JSON.stringify({
                      amount: (selectedProduct.unitPrice * purchaseData.quantity).toFixed(2),
                      product: selectedProduct.name,
                      quantity: purchaseData.quantity,
                      reference: `INV-${Date.now()}`,
                      customer: purchaseData.customerEmail
                    })}
                    size={250}
                    level="H"
                    includeMargin={true}
                    fgColor="#00d4ff"
                    bgColor="#1a1a2e"
                  />
                </div>
                
                <div className="payment-instructions">
                  <h4>Payment Instructions:</h4>
                  <ol>
                    <li>Open your mobile payment app (M-Pesa, PayPal, etc.)</li>
                    <li>Tap "Scan QR Code"</li>
                    <li>Scan the QR code above</li>
                    <li>Confirm the amount: <strong>${(selectedProduct.unitPrice * purchaseData.quantity).toFixed(2)}</strong></li>
                    <li>Complete the transaction</li>
                  </ol>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn" onClick={() => setShowPaymentQR(false)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-success" onClick={handlePurchaseSubmit}>
                    ✓ Payment Complete - Confirm Purchase
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="card form-card">
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="food">Food</option>
                  <option value="car-spare-parts">Car Spare Parts</option>
                  <option value="car-accessories">Car Accessories</option>
                  <option value="car-fluids">Car Fluids & Oils</option>
                  <option value="car-batteries">Car Batteries</option>
                  <option value="car-tyres">Car Tyres</option>
                  <option value="car-filters">Car Filters</option>
                </select>
              </div>
              <div className="form-group">
                <label>Unit Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Initial Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Min Stock</label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Max Stock</label>
                <input
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-success">
              Save Product
            </button>
          </form>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p className="empty-state">No products found. Add your first product!</p>
        ) : (
          filteredProducts.map((product) => {
            const lowStock = product.quantity <= product.minStock;
            return (
              <div key={product._id} className={`product-card ${lowStock ? 'low-stock' : ''}`}>
                <div className="product-header">
                  <h3>{product.name}</h3>
                  {lowStock && <span className="badge low-stock-badge">LOW STOCK</span>}
                </div>
                <p className="sku">SKU: {product.sku}</p>
                <p className="category">{product.category}</p>
                <div className="product-info">
                  <div className="info-item">
                    <span>Price:</span>
                    <strong>${product.unitPrice.toFixed(2)}</strong>
                  </div>
                  <div className="info-item">
                    <span>Quantity:</span>
                    <strong>{product.quantity}</strong>
                  </div>
                  <div className="info-item">
                    <span>Min: {product.minStock}</span>
                    <span>Max: {product.maxStock}</span>
                  </div>
                </div>
                {product.supplier && <p className="supplier">Supplier: {product.supplier}</p>}
                <div className="product-actions">
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => handlePurchaseClick(product)}
                    disabled={product.quantity === 0}
                  >
                    {product.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => handleQuantityChange(product._id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => handleQuantityChange(product._id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Products;

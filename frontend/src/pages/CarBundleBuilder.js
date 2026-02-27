import React, { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import { FaPlus, FaMinus, FaTrash, FaDownload, FaPrint } from 'react-icons/fa';
import '../styles/CarBundleBuilder.css';

const CarBundleBuilder = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [markup, setMarkup] = useState(20); // Default 20% markup
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarParts();
  }, []);

  const fetchCarParts = async () => {
    try {
      const { data } = await productAPI.getAllProducts();
      // Filter only car-related products
      const carProducts = data.filter(p => p.category.includes('car'));
      setProducts(carProducts);
    } catch (err) {
      console.error('Failed to fetch car parts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProductToBundle = (product) => {
    const existing = selectedProducts.find(p => p._id === product._id);
    if (existing) {
      updateBundleQuantity(product._id, existing.quantity + 1);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, bundleQty: 1 }]);
    }
  };

  const updateBundleQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromBundle(productId);
    } else {
      setSelectedProducts(selectedProducts.map(p =>
        p._id === productId ? { ...p, bundleQty: newQty } : p
      ));
    }
  };

  const removeFromBundle = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== productId));
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, p) => sum + (p.unitPrice * p.bundleQty), 0);
  };

  const calculateMarkup = () => {
    return calculateSubtotal() * (markup / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateMarkup();
  };

  const getTotalItems = () => {
    return selectedProducts.reduce((sum, p) => sum + p.bundleQty, 0);
  };

  const handleExportBundle = (format) => {
    const currentDate = new Date();
    const subtotal = calculateSubtotal();
    const markupAmount = calculateMarkup();
    const total = calculateTotal();

    const bundleData = {
      title: 'Car Maintenance Bundle Quote',
      generatedAt: currentDate.toLocaleString(),
      markup: `${markup}%`,
      items: selectedProducts.map(p => ({
        name: p.name,
        sku: p.sku,
        unitPrice: p.unitPrice,
        quantity: p.bundleQty,
        lineTotal: p.unitPrice * p.bundleQty
      })),
      subtotal,
      markupAmount,
      total
    };

    if (format === 'json') {
      const json = JSON.stringify(bundleData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CarBundle_${currentDate.toISOString().split('T')[0]}.json`;
      a.click();
    } else if (format === 'csv') {
      const csv = [
        ['Car Maintenance Bundle Quote'],
        ['Generated:', currentDate.toLocaleString()],
        ['Markup:', `${markup}%`],
        [],
        ['Product Name', 'SKU', 'Unit Price', 'Quantity', 'Line Total'],
        ...selectedProducts.map(p => [
          p.name,
          p.sku,
          `Ksh ${p.unitPrice}`,
          p.bundleQty,
          `Ksh ${(p.unitPrice * p.bundleQty).toFixed(2)}`
        ]),
        [],
        ['Subtotal', '', '', '', `Ksh ${subtotal.toFixed(2)}`],
        [`Markup (${markup}%)`, '', '', '', `Ksh ${markupAmount.toFixed(2)}`],
        ['Total', '', '', '', `Ksh ${total.toFixed(2)}`]
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CarBundle_${currentDate.toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="car-bundle-builder">
      <div className="builder-header">
        <div>
          <h1>🚗 Car Bundle Builder</h1>
          <p>Select and customize car parts for your customer quote</p>
        </div>
        <div className="header-actions">
          <input
            type="number"
            min="0"
            max="100"
            value={markup}
            onChange={(e) => setMarkup(parseFloat(e.target.value))}
            className="markup-input"
            placeholder="Markup %"
            title="Profit margin percentage"
          />
          <span className="markup-label">{markup}% Markup</span>
        </div>
      </div>

      <div className="builder-container">
        {/* Products Selection */}
        <div className="products-section">
          <h2>Available Car Parts</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-item">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="sku">{product.sku}</p>
                  <p className="category">{product.category}</p>
                  <p className="price">Ksh {product.unitPrice.toFixed(2)}</p>
                  <p className="stock">Stock: {product.quantity}</p>
                </div>
                <button
                  className="add-btn"
                  onClick={() => addProductToBundle(product)}
                  disabled={product.quantity <= 0}
                  title={product.quantity <= 0 ? 'Out of stock' : 'Add to bundle'}
                >
                  <FaPlus /> Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bundle Summary */}
        <div className="bundle-summary">
          <h2>📋 Bundle Summary</h2>

          {selectedProducts.length === 0 ? (
            <div className="empty-bundle">
              <p>No items selected yet</p>
              <p>Click "Add" on products to build your bundle</p>
            </div>
          ) : (
            <>
              <div className="bundle-items">
                {selectedProducts.map(product => (
                  <div key={product._id} className="bundle-item">
                    <div className="item-details">
                      <h4>{product.name}</h4>
                      <p>{product.sku}</p>
                      <p className="item-price">Ksh {product.unitPrice}</p>
                    </div>
                    <div className="item-quantity">
                      <button
                        onClick={() => updateBundleQuantity(product._id, product.bundleQty - 1)}
                        className="qty-btn"
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={product.bundleQty}
                        onChange={(e) => updateBundleQuantity(product._id, parseInt(e.target.value))}
                        className="qty-input"
                      />
                      <button
                        onClick={() => updateBundleQuantity(product._id, product.bundleQty + 1)}
                        className="qty-btn"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="item-total">
                      <p>Ksh {(product.unitPrice * product.bundleQty).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromBundle(product._id)}
                      className="remove-btn"
                      title="Remove from bundle"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div className="calculations">
                <div className="calc-row">
                  <span>Total Items:</span>
                  <strong>{getTotalItems()}</strong>
                </div>
                <div className="calc-row">
                  <span>Subtotal:</span>
                  <strong>Ksh {calculateSubtotal().toFixed(2)}</strong>
                </div>
                <div className="calc-row markup-row">
                  <span>Markup ({markup}%):</span>
                  <strong className="markup-amount">+ Ksh {calculateMarkup().toFixed(2)}</strong>
                </div>
                <div className="calc-row total-row">
                  <span>Total Amount:</span>
                  <strong className="total-amount">Ksh {calculateTotal().toFixed(2)}</strong>
                </div>
              </div>

              <div className="bundle-actions">
                <button className="export-btn" onClick={() => handleExportBundle('csv')}>
                  <FaDownload /> Export CSV
                </button>
                <button className="export-btn" onClick={() => handleExportBundle('json')}>
                  <FaDownload /> Export JSON
                </button>
                <button className="print-btn" onClick={handlePrint}>
                  <FaPrint /> Print Quote
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarBundleBuilder;

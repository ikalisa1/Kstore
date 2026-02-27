import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaReceipt, FaCalendar, FaDollarSign, FaUser, FaCreditCard, FaFileInvoice } from 'react-icons/fa';
import { salesAPI } from '../services/api';
import '../styles/Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSale, setSelectedSale] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await salesAPI.getAllSales();
        setSales(data || []);
      } catch (err) {
        console.error('Failed to fetch sales:', err);
        setSales([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
  const completedSales = sales.filter(s => s.status === 'completed').length;
  const pendingSales = sales.filter(s => s.status === 'pending').length;
  const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;

  const filteredSales = filterStatus === 'all' 
    ? sales 
    : sales.filter(s => s.status === filterStatus);

  const handlePrintInvoice = (sale) => {
    window.print();
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    return d.toLocaleDateString();
  };

  const formatTime = (value) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    return d.toLocaleTimeString();
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="sales-page">
      <div className="page-header">
        <div>
          <h1><FaShoppingCart /> Sales Management</h1>
          <p>Track and manage all your sales transactions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => window.print()}>
            <FaReceipt /> Print Summary
          </button>
        </div>
      </div>

      <div className="sales-stats">
        <div className="stat-card revenue">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${totalRevenue.toFixed(2)}</p>
            <span className="stat-info">All time</span>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Completed Sales</h3>
            <p className="stat-value">{completedSales}</p>
            <span className="stat-info">Transactions</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <FaCalendar />
          </div>
          <div className="stat-content">
            <h3>Pending Sales</h3>
            <p className="stat-value">{pendingSales}</p>
            <span className="stat-info">Awaiting payment</span>
          </div>
        </div>

        <div className="stat-card average">
          <div className="stat-icon">
            <FaReceipt />
          </div>
          <div className="stat-content">
            <h3>Avg Order Value</h3>
            <p className="stat-value">${avgOrderValue.toFixed(2)}</p>
            <span className="stat-info">Per transaction</span>
          </div>
        </div>
      </div>

      <div className="sales-filters">
        <button 
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All Sales ({sales.length})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Completed ({completedSales})
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending ({pendingSales})
        </button>
      </div>

      <div className="sales-table-container">
        {filteredSales.length === 0 ? (
          <div className="empty-state">
            <FaShoppingCart size={64} />
            <h2>No sales yet</h2>
            <p>Sales will appear here after purchases are completed</p>
          </div>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id} onClick={() => setSelectedSale(sale)}>
                  <td className="invoice-id">
                    <FaFileInvoice /> {sale.invoiceNumber || sale._id}
                  </td>
                  <td>
                    <div className="customer-info">
                      <FaUser />
                      <div>
                        <strong>{sale.customerName || 'Guest'}</strong>
                        <span>{sale.customerEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td>1 item</td>
                  <td>
                    <span className="payment-method">
                      <FaCreditCard /> {sale.paymentMethod || 'Cash'}
                    </span>
                  </td>
                  <td className="total">${(sale.totalPrice || 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${sale.status}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-time">
                      <span>{formatDate(sale.createdAt)}</span>
                      <span className="time">{formatTime(sale.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className="btn-icon" 
                      onClick={(e) => { e.stopPropagation(); handlePrintInvoice(sale); }}
                      title="Print Invoice"
                    >
                      <FaReceipt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedSale && (
        <div className="modal-overlay" onClick={() => setSelectedSale(null)}>
          <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-header">
              <div>
                <h2>Invoice {selectedSale.invoiceNumber || selectedSale._id}</h2>
                <p>{new Date(selectedSale.createdAt).toLocaleString()}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedSale(null)}>×</button>
            </div>

            <div className="invoice-details">
              <div className="invoice-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedSale.customerName || 'Guest'}</p>
                <p><strong>Email:</strong> {selectedSale.customerEmail}</p>
                <p><strong>Payment:</strong> {selectedSale.paymentMethod || 'Cash'}</p>
              </div>

              <div className="invoice-section">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedSale.productName}</td>
                      <td>{selectedSale.quantity}</td>
                      <td>${(selectedSale.unitPrice || 0).toFixed(2)}</td>
                      <td>${(selectedSale.totalPrice || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3"><strong>Total</strong></td>
                      <td><strong>${(selectedSale.totalPrice || 0).toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="invoice-actions">
                <button className="btn btn-primary" onClick={() => handlePrintInvoice(selectedSale)}>
                  <FaReceipt /> Print Invoice
                </button>
                <button className="btn" onClick={() => setSelectedSale(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;

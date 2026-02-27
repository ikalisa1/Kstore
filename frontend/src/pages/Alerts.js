import React, { useEffect, useState } from 'react';
import { FaBell, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaBox } from 'react-icons/fa';
import { productAPI } from '../services/api';
import '../styles/Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await productAPI.getAllProducts();
      
      // Generate alerts based on product stock levels
      const newAlerts = [];
      
      data.forEach(product => {
        if (product.quantity === 0) {
          newAlerts.push({
            id: `out-${product._id}`,
            type: 'error',
            title: 'Out of Stock',
            message: `${product.name} is out of stock!`,
            product: product.name,
            timestamp: new Date().toISOString(),
            icon: FaExclamationTriangle
          });
        } else if (product.quantity <= product.minStock) {
          newAlerts.push({
            id: `low-${product._id}`,
            type: 'warning',
            title: 'Low Stock Alert',
            message: `${product.name} stock is low (${product.quantity} remaining)`,
            product: product.name,
            timestamp: new Date().toISOString(),
            icon: FaExclamationTriangle
          });
        } else if (product.quantity >= product.maxStock * 0.9) {
          newAlerts.push({
            id: `high-${product._id}`,
            type: 'info',
            title: 'High Stock',
            message: `${product.name} is near maximum capacity`,
            product: product.name,
            timestamp: new Date().toISOString(),
            icon: FaInfoCircle
          });
        }
      });

      // Add system alerts
      if (data.length === 0) {
        newAlerts.push({
          id: 'no-products',
          type: 'info',
          title: 'No Products',
          message: 'No products in inventory. Add products to start tracking.',
          timestamp: new Date().toISOString(),
          icon: FaInfoCircle
        });
      } else {
        newAlerts.push({
          id: 'system-ok',
          type: 'success',
          title: 'System Status',
          message: `Monitoring ${data.length} products in inventory`,
          timestamp: new Date().toISOString(),
          icon: FaCheckCircle
        });
      }

      setAlerts(newAlerts);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertClass = (type) => {
    switch(type) {
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'success': return 'alert-success';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h1><FaBell /> System Alerts</h1>
          <p>Monitor inventory alerts and system notifications</p>
        </div>
        <button className="btn btn-primary" onClick={fetchAlerts}>
          Refresh Alerts
        </button>
      </div>

      <div className="alerts-stats">
        <div className="stat-box error">
          <FaExclamationTriangle />
          <span className="stat-number">{alerts.filter(a => a.type === 'error').length}</span>
          <span className="stat-label">Critical</span>
        </div>
        <div className="stat-box warning">
          <FaExclamationTriangle />
          <span className="stat-number">{alerts.filter(a => a.type === 'warning').length}</span>
          <span className="stat-label">Warnings</span>
        </div>
        <div className="stat-box success">
          <FaCheckCircle />
          <span className="stat-number">{alerts.filter(a => a.type === 'success').length}</span>
          <span className="stat-label">All Good</span>
        </div>
        <div className="stat-box info">
          <FaInfoCircle />
          <span className="stat-number">{alerts.filter(a => a.type === 'info').length}</span>
          <span className="stat-label">Info</span>
        </div>
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <FaBell size={64} />
            <h2>No alerts at this time</h2>
            <p>All systems are running smoothly</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`alert-card ${getAlertClass(alert.type)}`}>
              <div className="alert-icon">
                <alert.icon />
              </div>
              <div className="alert-content">
                <h3>{alert.title}</h3>
                <p>{alert.message}</p>
                {alert.product && <span className="alert-product"><FaBox /> {alert.product}</span>}
              </div>
              <div className="alert-time">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;

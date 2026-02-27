import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaDollarSign, FaBox, FaShoppingCart, FaUsers, FaExclamationTriangle, FaDownload, FaClock, FaFileExport, FaPrint } from 'react-icons/fa';
import { analyticsAPI, backupAPI, expenseAPI, productAPI } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real dashboard data from API
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const [dashboardData, expensesData, productsData] = await Promise.all([
          analyticsAPI.getDashboard(),
          expenseAPI.getExpensesByRange(startOfMonth.toISOString(), endOfMonth.toISOString()),
          productAPI.getAllProducts()
        ]);
        
        setAnalytics(dashboardData.data);
        setExpenses(expensesData.data?.expenses || []);
        setProducts(productsData.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        // If API fails, show empty data instead of fake data
        setAnalytics({
          todayExpenses: 0,
          monthlyExpenses: 0,
          productCount: 0,
          lowStockProducts: 0,
          totalRevenue: 0,
          activeSales: 0,
          lowStockCount: 0,
          totalProducts: 0,
          inventoryValue: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBackup = async () => {
    try {
      await backupAPI.createBackup();
      alert('✅ Backup created successfully');
    } catch (err) {
      console.error('Backup error:', err.response?.data || err.message);
      alert(`Backup creation initiated. ${err.message || 'Check backend logs for details'}`);
    }
  };

  const handleExport = (format) => {
    const currentDate = new Date();
    const data = {
      reportTitle: 'KstoreLtd Dashboard Report',
      generatedAt: currentDate.toISOString(),
      reportDate: currentDate.toLocaleDateString(),
      reportTime: currentDate.toLocaleTimeString(),
      metrics: analytics,
      expenses: expenses.map(e => ({
        ...e,
        recordedDate: new Date(e.date).toLocaleDateString(),
        recordedTime: new Date(e.date).toLocaleTimeString()
      })),
      products: products.map(p => ({
        ...p,
        addedDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A',
        lastUpdated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'N/A'
      })),
      summary: {
        totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
        totalProducts: products.length,
        lowStockItems: products.filter(p => p.quantity <= p.minStock).length,
        inventoryValue: products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0)
      }
    };

    if (format === 'json') {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KstoreLtd_Report_${currentDate.toISOString().split('T')[0]}.json`;
      a.click();
    } else if (format === 'csv') {
      const csv = [
        ['KstoreLtd Dashboard Report'],
        ['Generated:', currentDate.toLocaleString()],
        ['Report Date:', currentDate.toLocaleDateString()],
        [],
        ['=== SUMMARY METRICS ==='],
        ['Metric', 'Value', 'Date Recorded'],
        ['Today Expenses', `$${(analytics?.todayExpenses || 0).toFixed(2)}`, new Date().toLocaleDateString()],
        ['Monthly Expenses', `$${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`, new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })],
        ['Total Products', products.length, new Date().toLocaleDateString()],
        ['Low Stock Items', analytics?.lowStockCount || 0, new Date().toLocaleDateString()],
        ['Inventory Value', `$${(analytics?.inventoryValue || 0).toFixed(2)}`, new Date().toLocaleDateString()],
        [],
        ['=== RECENT EXPENSES ==='],
        ['Date', 'Category', 'Amount', 'Description', 'Payment Method'],
        ...expenses.slice(0, 10).map(e => [
          new Date(e.date).toLocaleDateString(),
          e.category,
          `$${e.amount}`,
          e.description,
          e.paymentMethod
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KstoreLtd_Report_${currentDate.toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  // Calculate monthly expenses from real data
  const monthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const lowStockCount = products.filter(p => p.quantity <= p.minStock).length;

  const services = [
    { icon: FaChartBar, title: 'Analytics', description: 'Real-time business insights', color: '#667eea', stats: `$${(analytics?.inventoryValue || 0).toFixed(2)}`, path: '/analytics' },
    { icon: FaDollarSign, title: 'Sales Tracking', description: 'Monitor daily transactions', color: '#764ba2', stats: expenses.length, path: '/sales' },
    { icon: FaBox, title: 'Inventory', description: 'Stock management system', color: '#4fc3f7', stats: products.length, path: '/inventory' },
    { icon: FaShoppingCart, title: 'Products', description: 'Manage product catalog', color: '#26c6da', stats: products.length, path: '/products' },
    { icon: FaUsers, title: 'Customers', description: 'Customer relationship', color: '#ffa726', stats: '0', path: '/customers' },
    { icon: FaExclamationTriangle, title: 'Alerts', description: 'System notifications', color: '#ef5350', stats: lowStockCount, path: '/alerts' },
    { icon: FaDownload, title: 'Backup & Export', description: 'Data management', color: '#ab47bc', stats: 'Active', path: null, action: handleBackup },
    { icon: FaClock, title: 'Reports', description: 'Generate reports', color: '#29b6f6', stats: new Date().toLocaleDateString(), path: '/analytics' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome to KstoreLtd</h1>
          <p>Manage your store with powerful tools and analytics</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => handleExport('csv')}>
            <FaFileExport /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={() => handleExport('json')}>
            <FaFileExport /> Export JSON
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
          <button className="btn btn-primary" onClick={handleBackup}>
            <FaDownload /> Backup Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <FaDollarSign />
          </div>
          <div className="metric-content">
            <p className="metric-label">Today's Expenses</p>
            <h3 className="metric-value">${(analytics?.todayExpenses || 0).toFixed(2)}</h3>
            <p className="metric-date">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)' }}>
            <FaChartBar />
          </div>
          <div className="metric-content">
            <p className="metric-label">Monthly Expenses</p>
            <h3 className="metric-value">${monthlyExpenses.toFixed(2)}</h3>
            <p className="metric-date">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #26c6da, #00bcd4)' }}>
            <FaBox />
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Products</p>
            <h3 className="metric-value">{products.length}</h3>
            <p className="metric-date">Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #ffa726, #fb8c00)' }}>
            <FaExclamationTriangle />
          </div>
          <div className="metric-content">
            <p className="metric-label">Low Stock Items</p>
            <h3 className="metric-value">{lowStockCount}</h3>
            <p className="metric-date">As of {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="services-section">
        <h2>Available Services</h2>
        <div className="services-grid">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            return (
              <div 
                key={index} 
                className="service-card"
                onClick={() => service.action ? service.action() : service.path && navigate(service.path)}
                style={{ cursor: 'pointer' }}
              >
                <div className="service-icon" style={{ background: service.color }}>
                  <ServiceIcon />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-stat">
                  <span className="stat-value">{service.stats}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" style={{ borderLeft: '4px solid #667eea' }} onClick={() => navigate('/analytics')}>
            <span>📊</span>
            <span>View Analytics</span>
          </button>
          <button className="action-btn" style={{ borderLeft: '4px solid #4fc3f7' }} onClick={() => navigate('/inventory')}>
            <span>📦</span>
            <span>Manage Inventory</span>
          </button>
          <button className="action-btn" style={{ borderLeft: '4px solid #26c6da' }} onClick={() => navigate('/expenses')}>
            <span>💰</span>
            <span>Track Expenses</span>
          </button>
          <button className="action-btn" style={{ borderLeft: '4px solid #ffa726' }} onClick={() => navigate('/customers')}>
            <span>👥</span>
            <span>Customer List</span>
          </button>
          <button className="action-btn" style={{ borderLeft: '4px solid #ef5350' }} onClick={() => navigate('/alerts')}>
            <span>🚨</span>
            <span>View Alerts</span>
          </button>
          <button className="action-btn" style={{ borderLeft: '4px solid #ab47bc' }} onClick={() => navigate('/products')}>
            <span>🛍️</span>
            <span>Manage Products</span>
          </button>
          <button className="action-btn" style={{ borderLeft: '4px solid #29b6f6' }} onClick={() => navigate('/sales')}>
            <span>💳</span>
            <span>View Sales</span>
          </button>
          <button className="action-btn" style={{ borderLeft: '4px solid #66bb6a' }} onClick={handleBackup}>
            <span>💾</span>
            <span>Backup Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

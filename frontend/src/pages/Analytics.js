import React, { useEffect, useState } from 'react';
import { FaChartLine, FaArrowUp, FaArrowDown, FaCalendar, FaDollarSign, FaShoppingCart, FaBoxes } from 'react-icons/fa';
import { expenseAPI, productAPI, salesAPI } from '../services/api';
import '../styles/Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalProducts: 0,
    avgProductPrice: 0,
    profitMargin: 0
  });
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 5);
      startDate.setDate(1);

      const [salesData, expensesData, productsData] = await Promise.all([
        salesAPI.getAllSales(),
        expenseAPI.getExpensesByRange(startDate.toISOString(), endDate.toISOString()),
        productAPI.getAllProducts()
      ]);

      const sales = salesData.data || [];
      const expenses = expensesData.data?.expenses || [];
      const products = productsData.data || [];

      const totalRevenue = sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const netProfit = totalRevenue - totalExpenses;

      const totalProducts = products.length;
      const totalInventoryValue = products.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);
      const avgPrice = totalProducts > 0 ? totalInventoryValue / totalProducts : 0;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      setStats({
        totalRevenue,
        totalExpenses,
        netProfit,
        totalProducts,
        avgProductPrice: avgPrice,
        profitMargin
      });

      // Build last 6 months data from DB
      const monthKeys = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthKeys.push({
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          label: d.toLocaleString('en-US', { month: 'short' })
        });
      }

      const salesByMonth = monthKeys.map(m => ({ month: m.label, revenue: 0, expenses: 0, profit: 0 }));

      sales.forEach(sale => {
        const d = new Date(sale.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const index = monthKeys.findIndex(m => m.key === key);
        if (index >= 0) {
          salesByMonth[index].revenue += sale.totalPrice || 0;
        }
      });

      expenses.forEach(exp => {
        const d = new Date(exp.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const index = monthKeys.findIndex(m => m.key === key);
        if (index >= 0) {
          salesByMonth[index].expenses += exp.amount || 0;
        }
      });

      salesByMonth.forEach(m => {
        m.profit = m.revenue - m.expenses;
      });

      setMonthlyData(salesByMonth);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const maxSeriesValue = Math.max(1, ...monthlyData.map(d => Math.max(d.revenue || 0, d.expenses || 0)));
  const maxProfitValue = Math.max(1, ...monthlyData.map(d => d.profit || 0));
  const averageMonthlyProfit = monthlyData.length
    ? monthlyData.reduce((sum, d) => sum + (d.profit || 0), 0) / monthlyData.length
    : 0;
  const expenseRatio = stats.totalRevenue > 0 ? (stats.totalExpenses / stats.totalRevenue) * 100 : 0;

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1><FaChartLine /> Business Analytics</h1>
          <p>Track your business performance and trends</p>
        </div>
        <button className="btn btn-primary" onClick={fetchAnalytics}>
          <FaCalendar /> Refresh Data
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">
            <FaDollarSign />
          </div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <span className="metric-trend up">
              <FaArrowUp /> 12.5% from last month
            </span>
          </div>
        </div>

        <div className="metric-card expenses">
          <div className="metric-icon">
            <FaShoppingCart />
          </div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <p className="metric-value">${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <span className="metric-trend down">
              <FaArrowDown /> 5.2% from last month
            </span>
          </div>
        </div>

        <div className="metric-card profit">
          <div className="metric-icon">
            <FaChartLine />
          </div>
          <div className="metric-content">
            <h3>Net Profit</h3>
            <p className="metric-value">${stats.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <span className={`metric-trend ${stats.netProfit >= 0 ? 'up' : 'down'}`}>
              {stats.netProfit >= 0 ? <FaArrowUp /> : <FaArrowDown />} 
              {stats.profitMargin.toFixed(1)}% margin
            </span>
          </div>
        </div>

        <div className="metric-card products">
          <div className="metric-icon">
            <FaBoxes />
          </div>
          <div className="metric-content">
            <h3>Total Products</h3>
            <p className="metric-value">{stats.totalProducts}</p>
            <span className="metric-info">
              Avg: ${stats.avgProductPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h2>Monthly Performance</h2>
          <div className="bar-chart">
            {monthlyData.map((data, index) => {
              const revenueHeight = ((data.revenue || 0) / maxSeriesValue) * 100;
              const expensesHeight = ((data.expenses || 0) / maxSeriesValue) * 100;
              
              return (
                <div key={index} className="bar-group">
                  <div className="bars">
                    <div 
                      className="bar revenue-bar" 
                      style={{ height: `${revenueHeight}%` }}
                      title={`Revenue: $${data.revenue.toFixed(0)}`}
                    ></div>
                    <div 
                      className="bar expenses-bar" 
                      style={{ height: `${expensesHeight}%` }}
                      title={`Expenses: $${data.expenses.toFixed(0)}`}
                    ></div>
                  </div>
                  <span className="bar-label">{data.month}</span>
                </div>
              );
            })}
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color revenue"></span> Revenue
            </span>
            <span className="legend-item">
              <span className="legend-color expenses"></span> Expenses
            </span>
          </div>
        </div>

        <div className="chart-card">
          <h2>Profit Trend</h2>
          <div className="line-chart">
            <svg viewBox="0 0 400 200" className="chart-svg">
              <defs>
                <linearGradient id="profitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#26c6da" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#26c6da" stopOpacity="0.05"/>
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="#e0e0e0" strokeWidth="1"/>
              <line x1="0" y1="100" x2="400" y2="100" stroke="#e0e0e0" strokeWidth="1"/>
              <line x1="0" y1="150" x2="400" y2="150" stroke="#e0e0e0" strokeWidth="1"/>
              
              {/* Profit line */}
              <polyline
                fill="url(#profitGradient)"
                stroke="#26c6da"
                strokeWidth="3"
                points={monthlyData.map((d, i) => {
                  const x = (i / (monthlyData.length - 1)) * 380 + 10;
                  const y = 180 - (((d.profit || 0) / maxProfitValue) * 150);
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Data points */}
              {monthlyData.map((d, i) => {
                const x = (i / (monthlyData.length - 1)) * 380 + 10;
                const y = 180 - (((d.profit || 0) / maxProfitValue) * 150);
                return (
                  <circle key={i} cx={x} cy={y} r="4" fill="#26c6da" stroke="white" strokeWidth="2"/>
                );
              })}
            </svg>
          </div>
          <div className="profit-summary">
            <p>Average Monthly Profit: <strong>${averageMonthlyProfit.toFixed(2)}</strong></p>
          </div>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <h3>💡 Key Insights</h3>
          <ul>
            <li>Revenue is trending upward this quarter</li>
            <li>Profit margin is healthy at {stats.profitMargin.toFixed(1)}%</li>
            <li>Operating expenses are under control</li>
            <li>Inventory value: ${stats.totalProducts * stats.avgProductPrice}</li>
          </ul>
        </div>

        <div className="insight-card">
          <h3>📊 Performance Indicators</h3>
          <div className="kpi-list">
            <div className="kpi-item">
              <span className="kpi-label">ROI</span>
              <span className="kpi-value positive">{(stats.profitMargin * 1.2).toFixed(1)}%</span>
            </div>
            <div className="kpi-item">
              <span className="kpi-label">Growth Rate</span>
              <span className="kpi-value positive">+12.5%</span>
            </div>
            <div className="kpi-item">
              <span className="kpi-label">Expense Ratio</span>
              <span className="kpi-value neutral">{expenseRatio.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

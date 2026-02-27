import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

export const expenseAPI = {
  getDailyExpenses: (date) => api.get(`/expenses/daily/${date}`),
  getExpensesByRange: (startDate, endDate) => api.get('/expenses/range', {
    params: { startDate, endDate }
  }),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`)
};

export const productAPI = {
  getAllProducts: () => api.get('/products'),
  getLowStockProducts: () => api.get('/products/low-stock'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

export const inventoryAPI = {
  getHistory: () => api.get('/inventory/history'),
  recordTransaction: (data) => api.post('/inventory/transaction', data)
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getMonthlyAnalytics: (month, year) => api.get('/analytics/monthly', {
    params: { month, year }
  })
};

export const backupAPI = {
  createBackup: () => api.post('/backup/create'),
  listBackups: () => api.get('/backup/list'),
  downloadBackup: (fileName) => api.get(`/backup/download/${fileName}`)
};

export const salesAPI = {
  createSale: (data) => api.post('/sales', data),
  getAllSales: () => api.get('/sales')
};

export default api;

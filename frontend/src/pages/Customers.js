import React, { useState } from 'react';
import { FaUsers, FaPlus, FaSearch, FaFileExport, FaPrint, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City',
      totalPurchases: 5420.00,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      address: '456 Oak Ave, Town',
      totalPurchases: 3200.50,
      createdAt: new Date().toISOString()
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    totalPurchases: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      // Update existing customer
      setCustomers(customers.map(c => 
        c.id === editingId ? { ...formData, id: editingId } : c
      ));
      setEditingId(null);
    } else {
      // Add new customer
      const newCustomer = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setCustomers([...customers, newCustomer]);
    }
    setFormData({ name: '', email: '', phone: '', address: '', totalPurchases: 0 });
    setShowForm(false);
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleExport = (format) => {
    if (format === 'csv') {
      const csv = [
        ['Name', 'Email', 'Phone', 'Address', 'Total Purchases'],
        ...customers.map(c => [c.name, c.email, c.phone, c.address, c.totalPurchases])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers_${new Date().toISOString()}.csv`;
      a.click();
    } else if (format === 'json') {
      const json = JSON.stringify(customers, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers_${new Date().toISOString()}.json`;
      a.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1><FaUsers /> Customer Management</h1>
          <p>Manage your customer relationships</p>
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
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <FaPlus /> Add Customer
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Customer name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="customer@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Customer address"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Total Purchases ($)</label>
                <input
                  type="number"
                  value={formData.totalPurchases}
                  onChange={(e) => setFormData({ ...formData, totalPurchases: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <FaUsers size={64} />
          <h2>No customers yet</h2>
          <p>Add your first customer to get started!</p>
        </div>
      ) : (
        <div className="customers-grid">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-actions">
                <button className="icon-btn" onClick={() => handleEdit(customer)}>
                  <FaEdit />
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(customer.id)}>
                  <FaTrash />
                </button>
              </div>
              <div className="customer-avatar">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <h3>{customer.name}</h3>
              <p className="customer-email">{customer.email}</p>
              <p className="customer-phone">{customer.phone}</p>
              {customer.address && <p className="customer-address">{customer.address}</p>}
              <div className="customer-stats">
                <span className="stat-label">Total Purchases:</span>
                <span className="stat-value">${customer.totalPurchases.toFixed(2)}</span>
              </div>
              <p className="customer-date">
                Member since: {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;

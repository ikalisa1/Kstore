import React, { useEffect, useState } from 'react';
import { inventoryAPI } from '../services/api';
import '../styles/Inventory.css';

const Inventory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await inventoryAPI.getHistory();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="inventory-page">
      <h1>Inventory History</h1>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No inventory transactions yet
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString()}</td>
                  <td>{t.product?.name} ({t.product?.sku})</td>
                  <td>
                    <span className={`badge badge-${t.type}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </td>
                  <td>{t.quantity}</td>
                  <td>{t.reason}</td>
                  <td>{t.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;

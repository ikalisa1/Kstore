import React, { useCallback, useEffect, useState } from 'react';
import { expenseAPI } from '../services/api';
import { format } from 'date-fns';
import '../styles/Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    amount: '',
    category: 'supplies',
    description: '',
    paymentMethod: 'cash'
  });

  const fetchExpenses = useCallback(async () => {
    try {
      const { data } = await expenseAPI.getDailyExpenses(selectedDate);
      setExpenses(data.expenses);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await expenseAPI.createExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(selectedDate)
      });
      setFormData({ amount: '', category: 'supplies', description: '', paymentMethod: 'cash' });
      setShowForm(false);
      fetchExpenses();
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      alert(`Failed to create expense: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Daily Expenses</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      <div className="date-selector">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="card form-card">
          <h2>Record New Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="supplies">Supplies</option>
                <option value="salary">Salary</option>
                <option value="utilities">Utilities</option>
                <option value="rent">Rent</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Payment</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Save Expense
            </button>
          </form>
        </div>
      )}

      <div className="stats-summary">
        <h2>Total Daily Expenses: ${total.toFixed(2)}</h2>
      </div>

      <div className="card">
        <h2>Expenses List</h2>
        {expenses.length === 0 ? (
          <p className="empty-state">No expenses recorded for this date</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Method</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{new Date(exp.date).toLocaleTimeString()}</td>
                  <td>${exp.amount.toFixed(2)}</td>
                  <td>{exp.category}</td>
                  <td>{exp.description}</td>
                  <td>{exp.paymentMethod}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={async () => {
                        if (window.confirm('Delete this expense?')) {
                          await expenseAPI.deleteExpense(exp._id);
                          fetchExpenses();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Expenses;

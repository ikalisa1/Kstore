import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>KstoreLtd</h2>
        </div>

        <div className="navbar-menu">
          <a
            href="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </a>
          <a
            href="/expenses"
            className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
          >
            Expenses
          </a>
          <a
            href="/products"
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          >
            Products
          </a>
          <a
            href="/inventory"
            className={`nav-link ${isActive('/inventory') ? 'active' : ''}`}
          >
            Inventory
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

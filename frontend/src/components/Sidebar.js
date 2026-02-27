import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChartBar, FaShoppingCart, FaBox, FaReceipt, FaCog, FaUsers, FaFileExport, FaBell, FaHome } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Update main-content margin when sidebar toggles
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.marginLeft = isOpen ? '280px' : '80px';
    }
  }, [isOpen]);

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/analytics', icon: FaChartBar, label: 'Analytics' },
    { path: '/sales', icon: FaShoppingCart, label: 'Sales' },
    { path: '/inventory', icon: FaBox, label: 'Inventory' },
    { path: '/expenses', icon: FaReceipt, label: 'Expenses' },
    { path: '/products', icon: FaBox, label: 'Products' },
    { path: '/customers', icon: FaUsers, label: 'Customers' },
    { path: '/alerts', icon: FaBell, label: 'Alerts' },
    { path: '/reports', icon: FaFileExport, label: 'Reports' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <div className="sidebar-container">
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1>KstoreLtd</h1>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon className="menu-icon" />
              {isOpen && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">JK</div>
            {isOpen && (
              <div className="user-info">
                <p className="user-name">KstoreLtd Manager</p>
                <p className="user-role">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

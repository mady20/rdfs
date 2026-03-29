import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU_CONFIG = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', key: 'admin_dashboard' },
    { label: 'Distributors', path: '/admin/distributors', key: 'admin_distributors' },
    { label: 'Retailers', path: '/admin/retailers', key: 'admin_retailers' },
    { label: 'Wallet Management', path: '/admin/wallets', key: 'admin_wallets' },
    { label: 'Transactions', path: '/admin/transactions', key: 'admin_transactions' },
    { label: 'Profile', path: '/profile', key: 'profile' },
    { label: 'Change Password', path: '/change-password', key: 'change_password' },
    { label: 'Logout', path: '/logout', key: 'logout_action' },
  ],
  distributor: [
    { label: 'Dashboard', path: '/distributor/dashboard', key: 'dist_dashboard' },
    { label: 'My Retailers', path: '/distributor/retailers', key: 'dist_retailers' },
    { label: 'Wallet', path: '/distributor/wallet', key: 'dist_wallet' },
    { label: 'Transactions', path: '/distributor/transactions', key: 'dist_transactions' },
    { label: 'Profile', path: '/profile', key: 'profile' },
    { label: 'Change Password', path: '/change-password', key: 'change_password' },
    { label: 'Logout', path: '/logout', key: 'logout_action' },
  ],
  retailer: [
    { label: 'Dashboard', path: '/retailer/dashboard', key: 'ret_dashboard' },
    { label: 'Wallet', path: '/retailer/wallet', key: 'ret_wallet' },
    { label: 'Transactions', path: '/retailer/transactions', key: 'ret_transactions' },
    { label: 'Create Transaction', path: '/retailer/transactions/create', key: 'ret_create_transaction' },
    { label: 'Profile', path: '/profile', key: 'profile' },
    { label: 'Change Password', path: '/change-password', key: 'change_password' },
    { label: 'Logout', path: '/logout', key: 'logout_action' },
  ],
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const menu = MENU_CONFIG[user.role] || [];

  const handleLogout = (e) => {
    if (e.currentTarget.getAttribute('data-action') === 'logout') {
      e.preventDefault();
      logout();
      navigate('/login');
    }
  };

  return (
    <aside className="layout-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">₹</div>
        <div className="sidebar-brand-text">
          <h2>VestaPay</h2>
          <p>Enterprise Admin</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
          <div key={item.key}>
            {item.key === 'logout_action' ? (
              <a
                href="#logout"
                className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={handleLogout}
                data-action="logout"
              >
                <span className="sidebar-nav-item-icon">↪</span>
                <span>{item.label}</span>
              </a>
            ) : (
              <Link
                to={item.path}
                className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-nav-item-icon">
                  {item.key === 'admin_dashboard' && '📊'}
                  {item.key === 'admin_distributors' && '🏢'}
                  {item.key === 'admin_retailers' && '🛍️'}
                  {item.key === 'admin_wallets' && '💼'}
                  {item.key === 'admin_transactions' && '📜'}
                  {item.key === 'dist_dashboard' && '📊'}
                  {item.key === 'dist_retailers' && '🏪'}
                  {item.key === 'dist_wallet' && '💰'}
                  {item.key === 'dist_transactions' && '📋'}
                  {item.key === 'ret_dashboard' && '📊'}
                  {item.key === 'ret_wallet' && '💵'}
                  {item.key === 'ret_transactions' && '📑'}
                  {item.key === 'ret_create_transaction' && '➕'}
                  {item.key === 'profile' && '👤'}
                  {item.key === 'change_password' && '🔑'}
                </span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

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
    <aside className="w-72 bg-white border-r border-border h-screen sticky top-0 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white text-lg font-bold">₹</div>
        <div>
          <h2 className="text-lg font-semibold">VestaPay</h2>
          <p className="text-sm text-on-surface-variant">Enterprise Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-auto">
        <ul className="flex flex-col gap-2">
          {menu.map((item) => (
            <li key={item.key}>
              {item.key === 'logout_action' ? (
                <a
                  href="#logout"
                  onClick={handleLogout}
                  data-action="logout"
                  className={`flex items-center gap-3 p-3 rounded-md ${location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container'}`}
                >
                  <span className="text-sm">↪</span>
                  <span className="text-sm">{item.label}</span>
                </a>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-md ${location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container'}`}
                >
                  <span className="text-sm">
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
                  <span className="text-sm">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

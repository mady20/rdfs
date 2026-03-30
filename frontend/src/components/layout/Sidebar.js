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
    <aside className="w-72 bg-white border-r border-border h-screen sticky top-0 p-6 flex flex-col gap-6 shadow-soft z-20">
      <div className="flex items-center gap-3 px-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white text-lg font-bold shadow-sm">₹</div>
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">VestaPay</h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">{user.role}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <ul className="flex flex-col gap-1.5">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            const baseLinkClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group";
            const activeClasses = isActive 
              ? "bg-primary text-white shadow-sm" 
              : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface";
            
            return (
              <li key={item.key}>
                {item.key === 'logout_action' ? (
                  <a
                    href="#logout"
                    onClick={handleLogout}
                    data-action="logout"
                    className={`${baseLinkClasses} text-error hover:bg-error/10 hover:text-error mt-4`}
                  >
                    <span className="text-lg transition-transform group-hover:-translate-x-1">↪</span>
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className={`${baseLinkClasses} ${activeClasses}`}
                  >
                    <span className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
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
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Inject custom scrollbar styles implicitly for the sidebar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--surface-dim);
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import DistributorListPage from '../pages/admin/DistributorListPage';
import RetailerListPage from '../pages/admin/RetailerListPage';
import UserFormPage from '../pages/admin/UserFormPage';
import WalletManagementPage from '../pages/admin/WalletManagementPage';
import TransactionManagementPage from '../pages/admin/TransactionManagementPage';

// Distributor Pages
import DistributorDashboardPage from '../pages/distributor/DistributorDashboardPage';
import DistributorRetailersPage from '../pages/distributor/DistributorRetailersPage';
import DistributorRetailerFormPage from '../pages/distributor/DistributorRetailerFormPage';
import DistributorWalletPage from '../pages/distributor/DistributorWalletPage';
import DistributorTransactionsPage from '../pages/distributor/DistributorTransactionsPage';

// Retailer Pages
import RetailerDashboardPage from '../pages/retailer/RetailerDashboardPage';
import RetailerWalletPage from '../pages/retailer/RetailerWalletPage';
import RetailerTransactionsPage from '../pages/retailer/RetailerTransactionsPage';
import CreateTransactionPage from '../pages/retailer/CreateTransactionPage';

// Profile Pages
import ProfilePage from '../pages/profile/ProfilePage';
import ChangePasswordPage from '../pages/profile/ChangePasswordPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/distributors" element={<ProtectedRoute roles={['admin']}><DistributorListPage /></ProtectedRoute>} />
      <Route path="/admin/retailers" element={<ProtectedRoute roles={['admin']}><RetailerListPage /></ProtectedRoute>} />
      <Route path="/admin/users/create" element={<ProtectedRoute roles={['admin']}><UserFormPage /></ProtectedRoute>} />
      <Route path="/admin/users/:id/edit" element={<ProtectedRoute roles={['admin']}><UserFormPage /></ProtectedRoute>} />
      <Route path="/admin/wallets" element={<ProtectedRoute roles={['admin']}><WalletManagementPage /></ProtectedRoute>} />
      <Route path="/admin/transactions" element={<ProtectedRoute roles={['admin']}><TransactionManagementPage /></ProtectedRoute>} />

      {/* Distributor Routes */}
      <Route path="/distributor/dashboard" element={<ProtectedRoute roles={['distributor']}><DistributorDashboardPage /></ProtectedRoute>} />
      <Route path="/distributor/retailers" element={<ProtectedRoute roles={['distributor']}><DistributorRetailersPage /></ProtectedRoute>} />
      <Route path="/distributor/retailers/create" element={<ProtectedRoute roles={['distributor']}><DistributorRetailerFormPage /></ProtectedRoute>} />
      <Route path="/distributor/retailers/:id/edit" element={<ProtectedRoute roles={['distributor']}><DistributorRetailerFormPage /></ProtectedRoute>} />
      <Route path="/distributor/wallet" element={<ProtectedRoute roles={['distributor']}><DistributorWalletPage /></ProtectedRoute>} />
      <Route path="/distributor/transactions" element={<ProtectedRoute roles={['distributor']}><DistributorTransactionsPage /></ProtectedRoute>} />

      {/* Retailer Routes */}
      <Route path="/retailer/dashboard" element={<ProtectedRoute roles={['retailer']}><RetailerDashboardPage /></ProtectedRoute>} />
      <Route path="/retailer/wallet" element={<ProtectedRoute roles={['retailer']}><RetailerWalletPage /></ProtectedRoute>} />
      <Route path="/retailer/transactions" element={<ProtectedRoute roles={['retailer']}><RetailerTransactionsPage /></ProtectedRoute>} />
      <Route path="/retailer/transactions/create" element={<ProtectedRoute roles={['retailer']}><CreateTransactionPage /></ProtectedRoute>} />

      {/* Profile Routes (All Authenticated Users) */}
      <Route path="/profile" element={<ProtectedRoute roles={['admin', 'distributor', 'retailer']}><ProfilePage /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute roles={['admin', 'distributor', 'retailer']}><ChangePasswordPage /></ProtectedRoute>} />

      {/* Catch All */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

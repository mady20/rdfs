import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));

// Admin
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const DistributorListPage = lazy(() => import('./pages/admin/DistributorListPage'));
const RetailerListPage = lazy(() => import('./pages/admin/RetailerListPage'));
const UserFormPage = lazy(() => import('./pages/admin/UserFormPage'));
const WalletManagementPage = lazy(() => import('./pages/admin/WalletManagementPage'));
const TransactionManagementPage = lazy(() => import('./pages/admin/TransactionManagementPage'));

// Distributor
const DistributorDashboardPage = lazy(() => import('./pages/distributor/DistributorDashboardPage'));
const DistributorRetailersPage = lazy(() => import('./pages/distributor/DistributorRetailersPage'));
const DistributorRetailerFormPage = lazy(() => import('./pages/distributor/DistributorRetailerFormPage'));
const DistributorWalletPage = lazy(() => import('./pages/distributor/DistributorWalletPage'));
const DistributorTransactionsPage = lazy(() => import('./pages/distributor/DistributorTransactionsPage'));

// Retailer
const RetailerDashboardPage = lazy(() => import('./pages/retailer/RetailerDashboardPage'));
const RetailerWalletPage = lazy(() => import('./pages/retailer/RetailerWalletPage'));
const RetailerTransactionsPage = lazy(() => import('./pages/retailer/RetailerTransactionsPage'));
const CreateTransactionPage = lazy(() => import('./pages/retailer/CreateTransactionPage'));

// Profile
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const ChangePasswordPage = lazy(() => import('./pages/profile/ChangePasswordPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/retailers" element={<ProtectedRoute roles={["admin"]}><RetailerListPage /></ProtectedRoute>} />
        <Route path="/admin/users/create" element={<ProtectedRoute roles={["admin"]}><UserFormPage /></ProtectedRoute>} />
        <Route path="/admin/users/:id/edit" element={<ProtectedRoute roles={["admin"]}><UserFormPage /></ProtectedRoute>} />
        <Route path="/admin/wallets" element={<ProtectedRoute roles={["admin"]}><WalletManagementPage /></ProtectedRoute>} />
        <Route path="/admin/transactions" element={<ProtectedRoute roles={["admin"]}><TransactionManagementPage /></ProtectedRoute>} />

        {/* Distributor Routes */}
        <Route path="/distributor/dashboard" element={<ProtectedRoute roles={["distributor"]}><DistributorDashboardPage /></ProtectedRoute>} />
        <Route path="/distributor/retailers" element={<ProtectedRoute roles={["distributor"]}><DistributorRetailersPage /></ProtectedRoute>} />
        <Route path="/distributor/retailers/create" element={<ProtectedRoute roles={["distributor"]}><DistributorRetailerFormPage /></ProtectedRoute>} />
        <Route path="/distributor/retailers/:id/edit" element={<ProtectedRoute roles={["distributor"]}><DistributorRetailerFormPage /></ProtectedRoute>} />
        <Route path="/distributor/wallet" element={<ProtectedRoute roles={["distributor"]}><DistributorWalletPage /></ProtectedRoute>} />
        <Route path="/distributor/transactions" element={<ProtectedRoute roles={["distributor"]}><DistributorTransactionsPage /></ProtectedRoute>} />

        {/* Retailer Routes */}
        <Route path="/retailer/dashboard" element={<ProtectedRoute roles={["retailer"]}><RetailerDashboardPage /></ProtectedRoute>} />
        <Route path="/retailer/wallet" element={<ProtectedRoute roles={["retailer"]}><RetailerWalletPage /></ProtectedRoute>} />
        <Route path="/retailer/transactions" element={<ProtectedRoute roles={["retailer"]}><RetailerTransactionsPage /></ProtectedRoute>} />
        <Route path="/retailer/transactions/create" element={<ProtectedRoute roles={["retailer"]}><CreateTransactionPage /></ProtectedRoute>} />

        {/* Profile Routes (All Authenticated Users) */}
        <Route path="/profile" element={<ProtectedRoute roles={["admin","distributor","retailer"]}><ProfilePage /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute roles={["admin","distributor","retailer"]}><ChangePasswordPage /></ProtectedRoute>} />

        {/* Catch All */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

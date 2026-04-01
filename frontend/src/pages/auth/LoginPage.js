import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import axiosInstance from '../../api/axios';
import { apiErrorMessage } from '../../utils/helpers';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      const response = await axiosInstance.get('/auth/me');
      const userRole = response.data.data.role;

      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'distributor') navigate('/distributor/dashboard');
      else navigate('/retailer/dashboard');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-[#3525cd] to-[#5640e6] text-white">
        <div className="text-center max-w-md">
          <div className="text-6xl font-bold mb-4">💰</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to VestaPay</h2>
          <p className="text-base opacity-90 leading-relaxed">Secure, efficient fintech platform for managing your finances with role-based access and real-time transactions.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-surface p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#3525cd] to-[#5640e6] flex items-center justify-center text-white text-xl font-bold">₹</div>
            </div>
            <h1 className="text-xl font-bold text-on-surface">VestaPay</h1>
            <p className="text-sm text-on-surface-variant">Internal Finance Platform</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded mb-4 flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-semibold"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-xs text-on-surface-variant font-semibold uppercase tracking-wide mb-4">Demo Credentials</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillCredentials('admin@example.com', 'Admin@123')}
                className="p-3 bg-white border border-border rounded-md text-left hover:bg-surface-bright transition-colors"
              >
                <div className="text-xs font-semibold text-on-surface mb-1">👨‍💼 Admin</div>
                <div className="text-[11px] text-on-surface-variant break-words">admin@vestapay.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('distributor@example.com', 'Distributor@123')}
                className="p-3 bg-white border border-border rounded-md text-left hover:bg-surface-bright transition-colors"
              >
                <div className="text-xs font-semibold text-on-surface mb-1">🏢 Distributor</div>
                <div className="text-[11px] text-on-surface-variant break-words">distributor@vestapay.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('retailer@example.com', 'Retailer@123')}
                className="col-span-2 p-3 bg-white border border-border rounded-md text-left hover:bg-surface-bright transition-colors"
              >
                <div className="text-xs font-semibold text-on-surface mb-1">👤 Retailer</div>
                <div className="text-[11px] text-on-surface-variant">retailer@vestapay.com</div>
              </button>
            </div>

            <p className="text-center text-xs text-on-surface-variant mt-4 mb-0">Click any credential button to fill the form</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

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

  const fillCredentialsAndSubmit = async (email, password) => {
    setFormData({ email, password });
    setError('');
    setLoading(true);

    try {
      await login(email, password);
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

  return (
    <div className="min-h-screen flex font-body bg-surface text-on-surface">
      {/* Left Side - Modern Abstract Gradient */}
      <div className="hidden md:flex flex-1 relative flex-col items-center justify-center p-12 overflow-hidden bg-white">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary-light/40 to-surface pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-dark/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-md animate-fade-in text-on-surface">
          <div className="text-7xl mb-8 transform hover:scale-110 transition-transform duration-300">
            💸
          </div>
          <h2 className="text-4xl font-headline font-bold mb-4 tracking-tight">
            Welcome to <span className="text-primary bg-clip-text">VestaPay</span>
          </h2>
          <p className="text-lg opacity-80 leading-relaxed text-on-surface-variant font-medium">
            A secure, efficient fintech platform designed for seamless financial management and real-time transaction tracking.
          </p>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-bright/50 backdrop-blur-md z-10 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.05)] border-l border-border/40 relative">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-primary/5 border border-border/50 animate-slide-up">
          {/* Header */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/30 flex items-center justify-center text-4xl font-bold text-white mb-6 transform -rotate-3 hover:rotate-3 transition-transform">
              ₹
            </div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-2 tracking-tight">
              Sign In
            </h1>
            <p className="text-on-surface-variant text-sm font-medium">
              VestaPay Internal Access
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-8 flex items-center gap-3 border border-error/20 animate-fade-in backdrop-blur-sm">
              <span className="text-xl">⚠️</span>
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-2">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@vestapay.com"
              required
            />
            <div className="mb-6">
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-base shadow-lg shadow-primary/30 hover:shadow-primary/40 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Secure Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="pt-8 border-t border-border/60">
            <p className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6 px-4 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border flex items-center gap-4">
              Demo Credentials
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillCredentials('admin@example.com', 'Admin@123')}
                className="p-3 bg-surface-container/30 border border-border/80 rounded-xl cursor-pointer transition-all duration-200 text-left hover:bg-primary/5 hover:border-primary/40 hover:shadow-sm group focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5">
                  <span className="group-hover:scale-110 transition-transform">👨‍💼</span> Admin
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('distributor@example.com', 'Distributor@123')}
                className="p-3 bg-surface-container/30 border border-border/80 rounded-xl cursor-pointer transition-all duration-200 text-left hover:bg-primary/5 hover:border-primary/40 hover:shadow-sm group focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5">
                  <span className="group-hover:scale-110 transition-transform">🏢</span> Dist
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('retailer@example.com', 'Retailer@123')}
                className="p-3 bg-surface-container/30 border border-border/80 rounded-xl cursor-pointer transition-all duration-200 text-left hover:bg-primary/5 hover:border-primary/40 hover:shadow-sm group col-span-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="text-xs font-bold text-on-surface mb-1 flex items-center gap-1.5 justify-center">
                  <span className="group-hover:scale-110 transition-transform">👤</span> Retailer
                </div>
              </button>
            </div>
            <p className="text-center text-xs text-on-surface-variant/70 mt-4 font-medium">
              Click to autofill
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

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
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Left Side - Gradient */}
      <div
        style={{
          flex: '1',
          background: 'linear-gradient(135deg, #3525cd 0%, #5640e6 100%)',
          display: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-2xl)',
          '@media (minWidth: 768px)': { display: 'flex' },
        }}
      >
        <div style={{ textAlign: 'center', color: 'white', maxWidth: '400px' }}>
          <div
            style={{
              fontSize: '64px',
              marginBottom: 'var(--spacing-lg)',
              fontWeight: 'bold',
            }}
          >
            💰
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
            Welcome to VestaPay
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: 1.6 }}>
            Secure, efficient fintech platform for managing your finances with role-based access and real-time transactions.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--surface)',
          padding: 'var(--spacing-lg)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3525cd 0%, #5640e6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                ₹
              </div>
            </div>
            <h1
              style={{
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--on-surface)',
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              VestaPay
            </h1>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--on-surface-variant)',
                fontSize: '14px',
                margin: 0,
              }}
            >
              Internal Finance Platform
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: '#ffebee',
                color: 'var(--error)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)',
                fontSize: '14px',
                border: '1px solid rgba(186, 26, 26, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
              }}
            >
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
            />

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
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
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #3525cd 0%, #5640e6 100%)',
                color: 'white',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(53, 37, 205, 0.25)',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div style={{ marginTop: 'var(--spacing-2xl)', paddingTop: 'var(--spacing-2xl)', borderTop: '1px solid var(--border)' }}>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--on-surface-variant)',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              Demo Credentials
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              {/* Admin */}
              <button
                type="button"
                onClick={() => fillCredentials('admin@example.com', 'Admin@123')}
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#3525cd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
                  👨‍💼 Admin
                </div>
                <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)', wordBreak: 'break-word' }}>
                  admin@vestapay.com
                </div>
              </button>

              {/* Distributor */}
              <button
                type="button"
                onClick={() => fillCredentials('distributor@example.com', 'Distributor@123')}
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#3525cd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
                  🏢 Distributor
                </div>
                <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)', wordBreak: 'break-word' }}>
                  distributor@ve...
                </div>
              </button>

              {/* Retailer */}
              <button
                type="button"
                onClick={() => fillCredentials('retailer@example.com', 'Retailer@123')}
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  gridColumn: '1 / -1',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#3525cd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
                  👤 Retailer
                </div>
                <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>
                  retailer@vestapay.com
                </div>
              </button>
            </div>

            <p
              style={{
                textAlign: 'center',
                fontSize: '12px',
                color: 'var(--on-surface-variant)',
                marginTop: 'var(--spacing-lg)',
                marginBottom: 0,
              }}
            >
              Click any credential button to fill the form
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

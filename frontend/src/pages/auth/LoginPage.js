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

      // Get user role to redirect
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--surface)',
        padding: 'var(--spacing-lg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-2xl)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ color: 'var(--primary)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
            VestaPay
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', margin: 0 }}>Internal Finance Platform</p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(186, 26, 26, 0.1)',
              color: 'var(--error)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-lg)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div style={{ marginTop: 'var(--spacing-2xl)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Demo Credentials:</p>
          <p><strong>Admin:</strong> admin@example.com / Admin@123</p>
          <p><strong>Distributor:</strong> distributor@example.com / Distributor@123</p>
          <p style={{ marginBottom: 0 }}><strong>Retailer:</strong> retailer@example.com / Retailer@123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

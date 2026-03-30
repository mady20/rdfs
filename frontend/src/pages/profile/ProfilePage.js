import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { apiErrorMessage } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/profile');
        const profile = response.data.data;
        setFormData({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          role: profile.role,
        });
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await axiosInstance.put('/profile', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLayout title="Profile"><Loader /></PageLayout>;

  return (
    <PageLayout title="My Profile">
      <Card className="max-w-2xl mx-auto shadow-md">
        {error && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-error/20 animate-fade-in">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100/50 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-green-200 animate-fade-in">
            <span className="text-xl">✅</span>
            <span className="text-sm font-semibold">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2 pb-6 border-b border-border/50">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase">
              {formData.name.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">{formData.name || 'User Profile'}</h3>
              <p className="text-sm text-on-surface-variant capitalize">{formData.role} Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="opacity-70 cursor-not-allowed bg-surface-dim"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
            />
            <Input
              label="Account Role"
              name="role"
              value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              disabled
              className="opacity-70 cursor-not-allowed bg-surface-dim capitalize"
            />
          </div>

          <Input
            label="Physical Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full physical address"
          />

          <div className="pt-4 mt-2 border-t border-border/50">
            <Button variant="primary" type="submit" disabled={submitting} className="w-full sm:w-auto px-8 py-3 text-base">
              {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default ProfilePage;

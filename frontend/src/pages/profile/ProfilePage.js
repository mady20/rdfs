import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { apiErrorMessage } from '../../utils/helpers';

export const ProfilePage = () => {
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
      <Card>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

        {success && <div className="bg-green-50 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            disabled
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <Input
            label="Role"
            name="role"
            value={formData.role}
            disabled
          />

          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </PageLayout>
  );
};

export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import axiosInstance from '../../api/axios';
import { apiErrorMessage } from '../../utils/helpers';

export const DistributorRetailerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    commissionPercent: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [mainError, setMainError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchRetailer = async () => {
        try {
          const response = await axiosInstance.get(`/users/${id}`);
          const user = response.data.data;
          setFormData({
            ...formData,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            commissionPercent: user.commissionPercent || 0,
            isActive: user.isActive,
          });
        } catch (err) {
          setMainError(apiErrorMessage(err));
        } finally {
          setLoading(false);
        }
      };
      fetchRetailer();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    setMainError('');

    try {
      if (isEdit) {
        await axiosInstance.put(`/users/${id}`, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          commissionPercent: formData.commissionPercent,
          isActive: formData.isActive,
        });
        navigate('/distributor/retailers');
      } else {
        await axiosInstance.post('/users/retailers', formData);
        navigate('/distributor/retailers');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMainError(apiErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLayout title="Loading..."><div>Loading...</div></PageLayout>;

  return (
    <PageLayout title={isEdit ? 'Edit Retailer' : 'Create Retailer'}>
      <Card className="max-w-3xl mx-auto shadow-md">
        {mainError && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-error/20 animate-fade-in">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-semibold">{mainError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Retailer Name"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEdit}
              error={errors.email}
              placeholder="email@example.com"
              required={!isEdit}
            />
          </div>

          {!isEdit && (
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+1234567890"
              required
            />
            <Input
              label="Commission %"
              name="commissionPercent"
              type="number"
              value={formData.commissionPercent}
              onChange={handleChange}
              error={errors.commissionPercent}
              placeholder="0.00"
            />
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full physical address"
          />

          {isEdit && (
            <div className="py-3 px-1 my-2 border-t border-b border-border bg-surface-bright rounded-lg flex items-center pl-4">
              <label className="inline-flex items-center cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <div className="w-11 h-6 bg-surface-dim rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors duration-300"></div>
                </div>
                <span className="ml-3 text-sm font-semibold text-on-surface">Active Status</span>
              </label>
            </div>
          )}

          <div className="flex gap-4 mt-8 pt-4 border-t border-border/50">
            <Button variant="primary" type="submit" disabled={submitting} className="flex-1 py-3 text-base">
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/distributor/retailers')}
              className="flex-1 py-3 text-base"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default DistributorRetailerFormPage;

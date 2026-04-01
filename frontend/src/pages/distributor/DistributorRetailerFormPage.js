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
          setFormData((prev) => ({
            ...prev,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            commissionPercent: user.commissionPercent || 0,
            isActive: user.isActive,
          }));
        } catch (err) {
          setMainError(apiErrorMessage(err));
        } finally {
          setLoading(false);
        }
      };
      fetchRetailer();
    }
  }, [id, isEdit]);

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
      <Card>
          {mainError && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{mainError}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
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
              required
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
            <Input
              label="Commission %"
              name="commissionPercent"
              type="number"
              value={formData.commissionPercent}
              onChange={handleChange}
              error={errors.commissionPercent}
            />
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          {isEdit && (
            <div>
              <label className="inline-flex items-center">
                <input
                  className="h-4 w-4 text-primary rounded"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="ml-3">Active</span>
              </label>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/distributor/retailers')}
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

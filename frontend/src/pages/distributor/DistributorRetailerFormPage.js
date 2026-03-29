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
      <Card>
        {mainError && (
          <div
            style={{
              backgroundColor: 'rgba(186, 26, 26, 0.1)',
              color: 'var(--error)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            {mainError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
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

          <div className="form-row">
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
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span style={{ marginLeft: 'var(--spacing-md)' }}>Active</span>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
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

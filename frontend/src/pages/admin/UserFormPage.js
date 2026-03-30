import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { apiErrorMessage } from '../../utils/helpers';

export const UserFormPage = () => {
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
    parentDistributor: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [distributors, setDistributors] = useState([]);
  const [userType, setUserType] = useState('distributor');
  const [mainError, setMainError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
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
            parentDistributor: user.parentDistributor?._id || '',
            isActive: user.isActive,
          });
          setUserType(user.role);
        } catch (err) {
          setMainError(apiErrorMessage(err));
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }

    const fetchDistributors = async () => {
      try {
        const response = await axiosInstance.get('/users/distributors');
        setDistributors(response.data.data.items || []);
      } catch (err) {
        console.error('Error fetching distributors:', err);
      }
    };
    fetchDistributors();
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
          parentDistributor: formData.parentDistributor,
        });
        navigate(userType === 'distributor' ? '/admin/distributors' : '/admin/retailers');
      } else {
        const endpoint = userType === 'distributor' ? '/users/distributors' : '/users/retailers';
        await axiosInstance.post(endpoint, formData);
        navigate(userType === 'distributor' ? '/admin/distributors' : '/admin/retailers');
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

  if (loading) return <PageLayout title="Loading..."><Loader /></PageLayout>;

  return (
    <PageLayout title={isEdit ? 'Edit User' : 'Create User'}>
      <Card className="max-w-3xl mx-auto shadow-md">
        {mainError && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-error/20 animate-fade-in">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-semibold">{mainError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {!isEdit && (
            <div className="mb-2">
              <Select
                label="User Type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                options={[
                  { label: 'Distributor', value: 'distributor' },
                  { label: 'Retailer', value: 'retailer' },
                ]}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Full Name"
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

          {userType === 'retailer' && (
            <Select
              label="Parent Distributor"
              name="parentDistributor"
              value={formData.parentDistributor}
              onChange={handleChange}
              options={distributors.map((d) => ({ label: d.name, value: d._id }))}
            />
          )}

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
              onClick={() =>
                navigate(userType === 'distributor' ? '/admin/distributors' : '/admin/retailers')
              }
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

export default UserFormPage;

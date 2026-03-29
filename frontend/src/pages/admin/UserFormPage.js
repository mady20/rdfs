import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
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

  if (loading) return <PageLayout title="Loading..."><div>Loading...</div></PageLayout>;

  return (
    <PageLayout title={isEdit ? 'Edit User' : 'Create User'}>
      <Card>
          {mainError && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{mainError}</div>
          )}

        <form onSubmit={handleSubmit}>
          {!isEdit && (
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
          )}

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
            <div className="py-2">
              <label className="inline-flex items-center">
                <input
                  className="form-checkbox h-4 w-4 text-primary rounded"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="ml-3">Active</span>
              </label>
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() =>
                navigate(userType === 'distributor' ? '/admin/distributors' : '/admin/retailers')
              }
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

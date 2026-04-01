import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatDate, apiErrorMessage } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

export const DistributorListPage = () => {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await axiosInstance.get('/users/distributors');
        setDistributors(response.data.data.items || []);
        setFilteredData(response.data.data.items || []);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchDistributors();
  }, []);
  const { showToast } = useToast();
  const showConfirm = useConfirm();

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = distributors.filter((d) =>
      d.name.toLowerCase().includes(value.toLowerCase()) ||
      d.email.toLowerCase().includes(value.toLowerCase()) ||
      d.phone.includes(value)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirm('Are you sure you want to delete this distributor?');
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/users/${id}`);
      setDistributors(distributors.filter((d) => d._id !== id));
      setFilteredData(filteredData.filter((d) => d._id !== id));
    } catch (err) {
      showToast(apiErrorMessage(err), { type: 'error' });
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await axiosInstance.patch(`/users/${id}/status`, { isActive: !isActive });
      const updated = distributors.map((d) =>
        d._id === id ? { ...d, isActive: !isActive } : d
      );
      setDistributors(updated);
      setFilteredData(updated.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        d.phone.includes(search)
      ));
    } catch (err) {
      showToast(apiErrorMessage(err), { type: 'error' });
    }
  };

  if (loading) return <PageLayout title="Distributors"><Loader /></PageLayout>;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'commissionPercent', label: 'Commission %' },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => {
        const cls = row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700';
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{row.isActive ? 'Active' : 'Inactive'}</span>;
      }
    },
    { key: 'address', label: 'Address' },
    { 
      key: 'createdAt', 
      label: 'Created',
      render: (row) => formatDate(row.createdAt)
    },
  ];

  const renderActions = (row) => (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={() => navigate(`/admin/users/${row._id}/edit`)}>
        Edit
      </Button>
      <Button variant="danger" onClick={() => handleDelete(row._id)}>
        Delete
      </Button>
      <Button 
        variant="secondary" 
        onClick={() => handleToggleStatus(row._id, row.isActive)}
      >
        {row.isActive ? 'Deactivate' : 'Activate'}
      </Button>
    </div>
  );

  return (
    <PageLayout title="Distributors">
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div>
            <Button variant="primary" onClick={() => navigate('/admin/users/create')}>
              + New Distributor
            </Button>
          </div>
        </div>

        <Table 
          columns={columns} 
          data={filteredData}
          renderActions={renderActions}
          emptyMessage="No distributors found"
        />
      </Card>
    </PageLayout>
  );
};

export default DistributorListPage;

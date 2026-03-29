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
    if (window.confirm('Are you sure you want to delete this distributor?')) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        setDistributors(distributors.filter((d) => d._id !== id));
        setFilteredData(filteredData.filter((d) => d._id !== id));
      } catch (err) {
        alert(apiErrorMessage(err));
      }
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
      alert(apiErrorMessage(err));
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
      render: (row) => <span className={`table-status status-${row.isActive ? 'active' : 'inactive'}`}>{row.isActive ? 'Active' : 'Inactive'}</span>
    },
    { key: 'address', label: 'Address' },
    { 
      key: 'createdAt', 
      label: 'Created',
      render: (row) => formatDate(row.createdAt)
    },
  ];

  const renderActions = (row) => (
    <div className="table-actions">
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
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

      <Card>
        <div className="section-actions">
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <Button variant="primary" onClick={() => navigate('/admin/users/create')}>
            + New Distributor
          </Button>
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

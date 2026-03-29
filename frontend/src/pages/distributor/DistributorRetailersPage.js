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

export const DistributorRetailersPage = () => {
  const navigate = useNavigate();
  const [retailers, setRetailers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const response = await axiosInstance.get('/users/retailers');
        setRetailers(response.data.data.items || []);
        setFilteredData(response.data.data.items || []);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchRetailers();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = retailers.filter((r) =>
      r.name.toLowerCase().includes(value.toLowerCase()) ||
      r.email.toLowerCase().includes(value.toLowerCase()) ||
      r.phone.includes(value)
    );
    setFilteredData(filtered);
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await axiosInstance.patch(`/users/${id}/status`, { isActive: !isActive });
      const updated = retailers.map((r) =>
        r._id === id ? { ...r, isActive: !isActive } : r
      );
      setRetailers(updated);
      setFilteredData(updated.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.includes(search)
      ));
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  };

  if (loading) return <PageLayout title="Retailers"><Loader /></PageLayout>;

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
      <Button variant="secondary" onClick={() => navigate(`/distributor/retailers/${row._id}/edit`)}>
        Edit
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
    <PageLayout title="My Retailers">
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

      <Card>
        <div className="section-actions">
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <Button variant="primary" onClick={() => navigate('/distributor/retailers/create')}>
            + New Retailer
          </Button>
        </div>

        <Table 
          columns={columns} 
          data={filteredData}
          renderActions={renderActions}
          emptyMessage="No retailers found"
        />
      </Card>
    </PageLayout>
  );
};

export default DistributorRetailersPage;

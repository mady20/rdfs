import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatDate, apiErrorMessage } from '../../utils/helpers';

export const RetailerListPage = () => {
  const navigate = useNavigate();
  const [retailers, setRetailers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRetailerId, setSelectedRetailerId] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [retailersRes, distributorsRes] = await Promise.all([
          axiosInstance.get('/users/retailers'),
          axiosInstance.get('/users/distributors'),
        ]);
        setRetailers(retailersRes.data.data.items || []);
        setFilteredData(retailersRes.data.data.items || []);
        setDistributors(distributorsRes.data.data.items || []);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this retailer?')) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        setRetailers(retailers.filter((r) => r._id !== id));
        setFilteredData(filteredData.filter((r) => r._id !== id));
      } catch (err) {
        alert(apiErrorMessage(err));
      }
    }
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

  const handleAssignDistributor = async () => {
    if (!selectedDistributor) {
      alert('Please select a distributor');
      return;
    }
    try {
      await axiosInstance.patch(`/users/${selectedRetailerId}/assign-distributor`, {
        parentDistributor: selectedDistributor,
      });
      const updated = retailers.map((r) =>
        r._id === selectedRetailerId
          ? { ...r, parentDistributor: { _id: selectedDistributor } }
          : r
      );
      setRetailers(updated);
      setFilteredData(updated.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.phone.includes(search)
      ));
      setShowAssignModal(false);
      setSelectedRetailerId(null);
      setSelectedDistributor('');
    } catch (err) {
      alert(apiErrorMessage(err));
    }
  };

  if (loading) return <PageLayout title="Retailers"><Loader /></PageLayout>;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'parentDistributor', 
      label: 'Distributor',
      render: (row) => row.parentDistributor?.name || '-'
    },
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
        onClick={() => {
          setSelectedRetailerId(row._id);
          setShowAssignModal(true);
        }}
      >
        Assign
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
    <PageLayout title="Retailers">
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

      <Card>
        <div className="section-actions">
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <Button variant="primary" onClick={() => navigate('/admin/users/create?type=retailer')}>
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

      <Modal
        isOpen={showAssignModal}
        title="Assign Distributor"
        onClose={() => {
          setShowAssignModal(false);
          setSelectedRetailerId(null);
          setSelectedDistributor('');
        }}
      >
        <Select
          label="Select Distributor"
          value={selectedDistributor}
          onChange={(e) => setSelectedDistributor(e.target.value)}
          options={distributors.map((d) => ({ label: d.name, value: d._id }))}
          required
        />
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
          <Button variant="primary" onClick={handleAssignDistributor}>
            Assign
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAssignModal(false);
              setSelectedRetailerId(null);
              setSelectedDistributor('');
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default RetailerListPage;

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
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${row.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'address', label: 'Address' },
    { 
      key: 'createdAt', 
      label: 'Created',
      render: (row) => formatDate(row.createdAt)
    },
  ];

  const renderActions = (row) => (
    <div className="flex items-center gap-2">
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
      {error && (
        <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-error/20 animate-fade-in">
          <span className="text-xl">⚠️</span>
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-96 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-on-surface-variant/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-on-surface placeholder:text-on-surface-variant/50 hover:border-on-surface-variant/30"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={() => navigate('/admin/users/create?type=retailer')}>
            <span className="mr-2 text-lg leading-none">➕</span> New Retailer
          </Button>
        </div>

        <Table 
          columns={columns} 
          data={filteredData}
          renderActions={renderActions}
          emptyMessage="No retailers found matching your criteria"
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
        <div className="flex items-center gap-3 mt-8">
          <Button variant="primary" onClick={handleAssignDistributor} className="flex-1">
            Assign
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAssignModal(false);
              setSelectedRetailerId(null);
              setSelectedDistributor('');
            }}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default RetailerListPage;

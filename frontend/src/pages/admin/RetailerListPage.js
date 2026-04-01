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
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

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
  const { showToast } = useToast();
  const showConfirm = useConfirm();

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
    const confirm = await showConfirm('Are you sure you want to delete this retailer?');
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/users/${id}`);
      setRetailers(retailers.filter((r) => r._id !== id));
      setFilteredData(filteredData.filter((r) => r._id !== id));
    } catch (err) {
      showToast(apiErrorMessage(err), { type: 'error' });
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
      showToast(apiErrorMessage(err), { type: 'error' });
    }
  };

  const handleAssignDistributor = async () => {
    if (!selectedDistributor) {
      showToast('Please select a distributor', { type: 'error' });
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
      showToast(apiErrorMessage(err), { type: 'error' });
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
            <Button variant="primary" onClick={() => navigate('/admin/users/create?type=retailer')}>
              + New Retailer
            </Button>
          </div>
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
        <div className="flex gap-3 mt-4">
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

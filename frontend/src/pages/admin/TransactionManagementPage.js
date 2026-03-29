import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatDate, formatCurrency, apiErrorMessage } from '../../utils/helpers';
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from '../../utils/constants';

export const TransactionManagementPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get('/transactions');
        setTransactions(response.data.data.items || []);
        setFilteredData(response.data.data.items || []);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const applyFilters = () => {
    let filtered = transactions;

    if (typeFilter) {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [typeFilter, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axiosInstance.delete(`/transactions/${id}`);
        setTransactions(transactions.filter((t) => t._id !== id));
        applyFilters();
      } catch (err) {
        alert(apiErrorMessage(err));
      }
    }
  };

  const handleOpenStatusModal = (transaction) => {
    setSelectedTransaction(transaction);
    setNewStatus(transaction.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    if (newStatus === selectedTransaction.status) {
      alert('Status is the same');
      return;
    }

    setUpdating(true);
    try {
      await axiosInstance.patch(`/transactions/${selectedTransaction._id}`, {
        status: newStatus,
      });

      const updated = transactions.map((t) =>
        t._id === selectedTransaction._id ? { ...t, status: newStatus } : t
      );
      setTransactions(updated);
      applyFilters();
      setShowModal(false);
      setSelectedTransaction(null);
    } catch (err) {
      alert(apiErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <PageLayout title="Transaction Management"><Loader /></PageLayout>;

  const columns = [
    { key: 'referenceId', label: 'Reference ID' },
    { 
      key: 'retailer', 
      label: 'Retailer',
      render: (row) => row.retailer?.name || '-'
    },
    { 
      key: 'distributor', 
      label: 'Distributor',
      render: (row) => row.distributor?.name || '-'
    },
    { key: 'type', label: 'Type' },
    { key: 'customerName', label: 'Customer' },
    { key: 'customerMobile', label: 'Mobile' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => <span className={`table-status status-${row.status}`}>{row.status}</span>
    },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
  ];

  const renderActions = (row) => (
    <div className="table-actions">
      <Button variant="secondary" onClick={() => handleOpenStatusModal(row)}>
        Change Status
      </Button>
      <Button variant="danger" onClick={() => handleDelete(row._id)}>
        Delete
      </Button>
    </div>
  );

  return (
    <PageLayout title="Transaction Management">
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

      <Card>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
          <Select
            label="Filter by Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { label: 'All Types', value: '' },
              ...TRANSACTION_TYPES.map((t) => ({ label: t, value: t })),
            ]}
            style={{ maxWidth: '200px' }}
          />
          <Select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Status', value: '' },
              ...TRANSACTION_STATUS.map((s) => ({ label: s, value: s })),
            ]}
            style={{ maxWidth: '200px' }}
          />
        </div>

        <Table 
          columns={columns} 
          data={filteredData}
          renderActions={renderActions}
          emptyMessage="No transactions found"
        />
      </Card>

      <Modal
        isOpen={showModal}
        title="Update Transaction Status"
        onClose={() => {
          setShowModal(false);
          setSelectedTransaction(null);
        }}
      >
        <Select
          label="New Status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          options={TRANSACTION_STATUS.map((s) => ({ label: s, value: s }))}
        />
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
          <Button 
            variant="primary" 
            onClick={handleUpdateStatus}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setSelectedTransaction(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default TransactionManagementPage;

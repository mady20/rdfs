import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatDate, formatCurrency, apiErrorMessage } from '../../utils/helpers';
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from '../../utils/constants';

export const RetailerTransactionsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  useEffect(() => {
    let filtered = transactions;

    if (typeFilter) {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [typeFilter, statusFilter, transactions]);

  if (loading) return <PageLayout title="Transactions"><Loader /></PageLayout>;

  const columns = [
    { key: 'referenceId', label: 'Reference ID' },
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

  return (
    <PageLayout title="Transactions">
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

      <Card>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, maxWidth: '200px' }}>
            <Select
              label="Filter by Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { label: 'All Types', value: '' },
                ...TRANSACTION_TYPES.map((t) => ({ label: t, value: t })),
              ]}
            />
          </div>
          <div style={{ flex: 1, maxWidth: '200px' }}>
            <Select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Status', value: '' },
                ...TRANSACTION_STATUS.map((s) => ({ label: s, value: s })),
              ]}
            />
          </div>
          <Button variant="primary" onClick={() => navigate('/retailer/transactions/create')}>
            + New Transaction
          </Button>
        </div>

        <Table 
          columns={columns} 
          data={filteredData}
          emptyMessage="No transactions found"
        />
      </Card>
    </PageLayout>
  );
};

export default RetailerTransactionsPage;

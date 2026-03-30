import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Select from '../../components/common/Select';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatDate, formatCurrency, apiErrorMessage } from '../../utils/helpers';
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from '../../utils/constants';

export const DistributorTransactionsPage = () => {
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
    { key: 'retailer', label: 'Retailer', render: (row) => row.retailer?.name || '-' },
    { key: 'type', label: 'Type' },
    { key: 'customerName', label: 'Customer' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => {
        const s = (row.status || '').toLowerCase();
        const cls = s === 'success' ? 'bg-green-100 text-green-800 border-green-200' : s === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200';
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${cls}`}>{row.status}</span>;
      }
    },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <PageLayout title="Transactions">
      {error && (
        <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-error/20 animate-fade-in">
          <span className="text-xl">⚠️</span>
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-surface-bright p-4 rounded-xl border border-border items-end">
          <div className="flex-1 w-full max-w-[200px]">
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
          <div className="flex-1 w-full max-w-[200px]">
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
        </div>

        <Table 
          columns={columns} 
          data={filteredData}
          emptyMessage="No transactions found matching the selected filters"
        />
      </Card>
    </PageLayout>
  );
};

export default DistributorTransactionsPage;

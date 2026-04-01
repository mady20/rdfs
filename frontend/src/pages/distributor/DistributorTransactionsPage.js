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
        const cls = s === 'success' ? 'bg-green-100 text-green-800' : s === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{row.status}</span>;
      }
    },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <PageLayout title="Transactions">
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-48">
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
            <div className="w-full sm:w-48">
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

export default DistributorTransactionsPage;

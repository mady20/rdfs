import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatDate, formatCurrency, apiErrorMessage } from '../../utils/helpers';

export const DistributorDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/distributor');
        setData(response.data.data);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLayout title="Dashboard"><Loader /></PageLayout>;

  const transactionColumns = [
    { key: 'referenceId', label: 'Reference ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => <span className={`table-status status-${row.status}`}>{row.status}</span>
    },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <PageLayout title="Distributor Dashboard">
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}
      
      <div className="dashboard-cards">
        <Card>
          <div className="card-title">My Wallet Balance</div>
          <div className="card-value">{formatCurrency(data?.ownWalletBalance || 0)}</div>
        </Card>
        <Card>
          <div className="card-title">Total Retailers</div>
          <div className="card-value">{data?.retailerCount || 0}</div>
        </Card>
      </div>

      <div style={{ marginTop: 'var(--spacing-2xl)' }}>
        <Card title="Recent Retailer Transactions">
          <Table 
            columns={transactionColumns} 
            data={data?.recentRetailerTransactions || []}
            emptyMessage="No transactions yet"
          />
        </Card>
      </div>
    </PageLayout>
  );
};

export default DistributorDashboardPage;

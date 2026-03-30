import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatDate, formatCurrency, apiErrorMessage } from '../../utils/helpers';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/admin');
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
    { 
      key: 'amount', 
      label: 'Amount',
      render: (row) => formatCurrency(row.amount)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const s = (row.status || '').toLowerCase();
        const cls = s === 'success' ? 'bg-green-100 text-green-800' : s === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{row.status}</span>;
      }
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (row) => formatDate(row.createdAt)
    },
  ];

  return (
    <PageLayout title="Admin Dashboard">
      {error && <div className="text-red-600 mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center gap-5">
                <div className="text-3xl p-3 bg-primary/10 rounded-2xl text-primary">👥</div>
                <div>
                  <div className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Total Users</div>
                  <div className="text-3xl font-bold text-on-surface">{data?.totalUsers || 0}</div>
                  <div className="text-xs text-on-surface-variant/70 mt-1 font-medium">All roles combined</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-5">
                <div className="text-3xl p-3 bg-primary/10 rounded-2xl text-primary">🏢</div>
                <div>
                  <div className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Distributors</div>
                  <div className="text-3xl font-bold text-on-surface">{data?.totalDistributors || 0}</div>
                  <div className="text-xs text-on-surface-variant/70 mt-1 font-medium">Active partners</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-5">
                <div className="text-3xl p-3 bg-primary/10 rounded-2xl text-primary">🛒</div>
                <div>
                  <div className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Retailers</div>
                  <div className="text-3xl font-bold text-on-surface">{data?.totalRetailers || 0}</div>
                  <div className="text-xs text-on-surface-variant/70 mt-1 font-medium">Point-of-sale outlets</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-5">
                <div className="text-3xl p-3 bg-primary/10 rounded-2xl text-primary">💰</div>
                <div>
                  <div className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Wallet Balance</div>
                  <div className="text-3xl font-bold text-on-surface">{formatCurrency(data?.totalWalletBalance || 0)}</div>
                  <div className="text-xs text-on-surface-variant/70 mt-1 font-medium">System-wide balance</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8">
            <Card title="Recent Transactions">
              <Table 
                columns={transactionColumns} 
                data={data?.recentTransactions || []}
                emptyMessage="No recent transactions found"
              />
            </Card>
          </div>
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <Card title="Quick Actions">
            <div className="flex flex-col gap-3">
              <Button variant="primary" className="w-full justify-start py-3">
                <span className="mr-3 text-lg">➕</span> Create Distributor
              </Button>
              <Button variant="secondary" className="w-full justify-start py-3">
                <span className="mr-3 text-lg">➕</span> Create Retailer
              </Button>
              <Button variant="secondary" className="w-full justify-start py-3">
                <span className="mr-3 text-lg">💱</span> Adjust Wallet
              </Button>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="flex flex-col gap-4">
              {(data?.activity || []).slice(0,6).map((a, i) => (
                <div key={a._id || a.id || i} className="flex gap-4 items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-on-surface mb-0.5">{a.title || a.message}</div>
                    <div className="text-xs font-medium text-on-surface-variant/70">{formatDate(a.createdAt)}</div>
                  </div>
                </div>
              ))}
              {!data?.activity?.length && (
                <div className="text-sm font-medium text-on-surface-variant text-center py-4 bg-surface-bright rounded-xl border border-border">
                  No recent activity
                </div>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </PageLayout>
  );
};

export default AdminDashboardPage;

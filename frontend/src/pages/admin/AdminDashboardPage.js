import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatDate, formatCurrency, apiErrorMessage } from '../../utils/helpers';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center gap-4">
                <div className="text-2xl">👥</div>
                <div>
                  <div className="text-sm text-gray-500">Total Users</div>
                  <div className="text-2xl font-semibold">{data?.totalUsers || 0}</div>
                  <div className="text-sm text-gray-400">All roles combined</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="text-2xl">🏢</div>
                <div>
                  <div className="text-sm text-gray-500">Distributors</div>
                  <div className="text-2xl font-semibold">{data?.totalDistributors || 0}</div>
                  <div className="text-sm text-gray-400">Active partners</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="text-2xl">🛒</div>
                <div>
                  <div className="text-sm text-gray-500">Retailers</div>
                  <div className="text-2xl font-semibold">{data?.totalRetailers || 0}</div>
                  <div className="text-sm text-gray-400">Point-of-sale outlets</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="text-2xl">💰</div>
                <div>
                  <div className="text-sm text-gray-500">Wallet Balance</div>
                  <div className="text-2xl font-semibold">{formatCurrency(data?.totalWalletBalance || 0)}</div>
                  <div className="text-sm text-gray-400">System-wide balance</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8">
            <Card title="Recent Transactions">
              <Table 
                columns={transactionColumns} 
                data={data?.recentTransactions || []}
                emptyMessage="No transactions yet"
              />
            </Card>
          </div>
        </div>

        <aside className="lg:col-span-1 space-y-4">
          <Card title="Quick Actions">
            <div className="flex flex-col gap-3">
              <Button variant="primary" onClick={() => navigate('/admin/distributors/create')}>Create Distributor</Button>
              <Button variant="secondary" onClick={() => navigate('/admin/retailers/create')}>Create Retailer</Button>
              <Button variant="secondary">Adjust Wallet</Button>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              {(data?.activity || []).slice(0,6).map((a) => (
                <div key={a._id || a.id}>
                  <div className="font-medium text-gray-800">{a.title || a.message}</div>
                  <div className="text-xs text-gray-400">{formatDate(a.createdAt)}</div>
                </div>
              ))}
              {!data?.activity?.length && <div className="text-gray-500">No recent activity</div>}
            </div>
          </Card>
        </aside>
      </div>
    </PageLayout>
  );
};

export default AdminDashboardPage;

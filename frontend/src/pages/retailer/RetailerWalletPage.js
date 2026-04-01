import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatCurrency, apiErrorMessage } from '../../utils/helpers';

export const RetailerWalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, ledgerRes] = await Promise.all([
          axiosInstance.get('/wallets/my'),
          axiosInstance.get('/wallets/my-ledger'),
        ]);
        setWallet(walletRes.data.data);
        setLedger(ledgerRes.data.data.items || []);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLayout title="Wallet"><Loader /></PageLayout>;

  return (
    <PageLayout title="My Wallet">
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <Card title="Wallet Balance">
        <div className="text-2xl text-primary font-bold mb-4">{formatCurrency(wallet?.balance || 0)}</div>
      </Card>

      <Card title="Ledger History">
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-surface-container">
                <th className="text-left px-4 py-2 text-sm font-semibold">Type</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Amount</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Before</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">After</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {ledger.length > 0 ? (
                ledger.slice(0, 10).map((entry) => (
                  <tr key={entry._id} className="hover:bg-surface-bright">
                    <td className="px-4 py-2 text-sm">{entry.type}</td>
                    <td className="px-4 py-2 text-sm">{formatCurrency(entry.amount)}</td>
                    <td className="px-4 py-2 text-sm">{formatCurrency(entry.balanceBefore)}</td>
                    <td className="px-4 py-2 text-sm">{formatCurrency(entry.balanceAfter)}</td>
                    <td className="px-4 py-2 text-sm">{entry.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">No entries</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageLayout>
  );
};

export default RetailerWalletPage;

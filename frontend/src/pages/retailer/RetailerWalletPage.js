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
      {error && (
        <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-error/20 animate-fade-in">
          <span className="text-xl">⚠️</span>
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <Card title="Wallet Balance" className="mb-6">
        <div className="text-4xl font-headline font-bold text-primary mb-2">
          {formatCurrency(wallet?.balance || 0)}
        </div>
        <p className="text-on-surface-variant font-medium">Available Balance</p>
      </Card>

      <Card title="Ledger History">
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border/80 text-xs uppercase tracking-wider text-on-surface-variant/70 font-bold bg-surface-bright/50">
                <th className="px-4 py-3 rounded-tl-xl">Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Before</th>
                <th className="px-4 py-3 text-right">After</th>
                <th className="px-4 py-3 rounded-tr-xl">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium text-sm">
              {ledger.length > 0 ? (
                ledger.slice(0, 10).map((entry) => (
                  <tr key={entry._id} className="hover:bg-primary/5 transition-colors duration-200">
                    <td className="px-4 py-3 text-on-surface capitalize">{entry.type}</td>
                    <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(entry.amount)}</td>
                    <td className="px-4 py-3 text-right text-on-surface-variant">{formatCurrency(entry.balanceBefore)}</td>
                    <td className="px-4 py-3 text-right text-on-surface-variant">{formatCurrency(entry.balanceAfter)}</td>
                    <td className="px-4 py-3 text-on-surface-variant/90">{entry.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-on-surface-variant font-medium">No transaction entries found</td>
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

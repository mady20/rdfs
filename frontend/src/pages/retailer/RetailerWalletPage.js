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
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

      <Card title="Wallet Balance">
        <div style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--primary)', fontWeight: 'bold', marginBottom: 'var(--spacing-lg)' }}>
          {formatCurrency(wallet?.balance || 0)}
        </div>
      </Card>

      <Card title="Ledger History">
        <table className="table" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Before</th>
              <th>After</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {ledger.length > 0 ? (
              ledger.slice(0, 10).map((entry) => (
                <tr key={entry._id}>
                  <td>{entry.type}</td>
                  <td>{formatCurrency(entry.amount)}</td>
                  <td>{formatCurrency(entry.balanceBefore)}</td>
                  <td>{formatCurrency(entry.balanceAfter)}</td>
                  <td>{entry.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No entries</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </PageLayout>
  );
};

export default RetailerWalletPage;

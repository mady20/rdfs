import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatCurrency, apiErrorMessage } from '../../utils/helpers';

export const DistributorWalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [retailers, setRetailers] = useState([]);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, ledgerRes, retailersRes] = await Promise.all([
          axiosInstance.get('/wallets/my'),
          axiosInstance.get('/wallets/my-ledger'),
          axiosInstance.get('/users/retailers'),
        ]);
        setWallet(walletRes.data.data);
        setLedger(ledgerRes.data.data.items || []);
        setRetailers(retailersRes.data.data.items || []);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferTo || !transferAmount) {
      alert('Please fill all fields');
      return;
    }

    setTransferring(true);
    try {
      const response = await axiosInstance.post('/wallets/transfer', {
        toUser: transferTo,
        amount: parseFloat(transferAmount),
      });
      setWallet(response.data.data.wallet);
      const ledgerRes = await axiosInstance.get('/wallets/my-ledger');
      setLedger(ledgerRes.data.data.items || []);
      setTransferTo('');
      setTransferAmount('');
      alert('Transfer successful');
    } catch (err) {
      alert(apiErrorMessage(err));
    } finally {
      setTransferring(false);
    }
  };

  if (loading) return <PageLayout title="Wallet"><Loader /></PageLayout>;

  return (
    <PageLayout title="My Wallet">
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

      <Card title="Wallet Balance">
        <div style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--primary)', fontWeight: 'bold', marginBottom: 'var(--spacing-lg)' }}>
          {formatCurrency(wallet?.balance || 0)}
        </div>
      </Card>

      <Card title="Transfer to Retailer">
        <form onSubmit={handleTransfer}>
          <select
            name="transferTo"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              marginBottom: 'var(--spacing-md)',
            }}
            required
          >
            <option value="">-- Select Retailer --</option>
            {retailers.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} ({r.email})
              </option>
            ))}
          </select>

          <Input
            label="Amount"
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            required
          />

          <Button 
            variant="primary" 
            type="submit"
            disabled={transferring}
          >
            {transferring ? 'Transferring...' : 'Transfer'}
          </Button>
        </form>
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

export default DistributorWalletPage;

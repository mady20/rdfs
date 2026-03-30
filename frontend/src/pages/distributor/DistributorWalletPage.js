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
      {error && (
        <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-error/20 animate-fade-in">
          <span className="text-xl">⚠️</span>
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Wallet Balance" className="flex flex-col justify-center">
          <div className="text-4xl font-headline font-bold text-primary mb-2">
            {formatCurrency(wallet?.balance || 0)}
          </div>
          <p className="text-on-surface-variant font-medium">Available Balance</p>
        </Card>

        <Card title="Transfer to Retailer">
          <form onSubmit={handleTransfer} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-on-surface mb-1.5 uppercase tracking-wide">
                Select Retailer
              </label>
              <select
                name="transferTo"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-on-surface hover:border-on-surface-variant/30"
                required
              >
                <option value="" disabled>-- Select Retailer --</option>
                {retailers.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.email})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="0.00"
              required
            />

            <Button 
              variant="primary" 
              type="submit"
              disabled={transferring}
              className="py-3 text-base mt-2"
            >
              {transferring ? 'Transferring...' : 'Send Funds'}
            </Button>
          </form>
        </Card>
      </div>

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

export default DistributorWalletPage;

import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import axiosInstance from '../../api/axios';
import { formatCurrency, formatDate, apiErrorMessage } from '../../utils/helpers';

export const WalletManagementPage = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [adjustType, setAdjustType] = useState('credit');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustDescription, setAdjustDescription] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await axiosInstance.get('/wallets');
        setWallets(response.data.data.items || []);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  const handleOpenModal = async (wallet) => {
    setSelectedWallet(wallet);
    setSelectedUserId(wallet.user._id);
    try {
      const response = await axiosInstance.get(`/wallets/ledger/${wallet.user._id}`);
      setLedgerData(response.data.data.items || []);
    } catch (err) {
      console.error('Error fetching ledger:', err);
    }
    setShowModal(true);
  };

  const handleAdjustWallet = async () => {
    if (!adjustAmount || !adjustDescription) {
      alert('Please fill all fields');
      return;
    }

    setAdjusting(true);
    try {
      await axiosInstance.post(`/wallets/${selectedWallet._id}/adjust`, {
        type: adjustType,
        amount: parseFloat(adjustAmount),
        description: adjustDescription,
      });

      const updated = wallets.map((w) =>
        w._id === selectedWallet._id
          ? {
              ...w,
              balance:
                adjustType === 'credit'
                  ? w.balance + parseFloat(adjustAmount)
                  : w.balance - parseFloat(adjustAmount),
            }
          : w
      );
      setWallets(updated);

      const response = await axiosInstance.get(`/wallets/ledger/${selectedUserId}`);
      setLedgerData(response.data.data.items || []);

      setAdjustAmount('');
      setAdjustDescription('');
    } catch (err) {
      alert(apiErrorMessage(err));
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) return <PageLayout title="Wallet Management"><Loader /></PageLayout>;

  const walletColumns = [
    { key: 'user', label: 'User', render: (row) => row.user.name },
    { key: 'user.email', label: 'Email', render: (row) => row.user.email },
    { key: 'user.role', label: 'Role', render: (row) => row.user.role },
    { key: 'balance', label: 'Balance', render: (row) => formatCurrency(row.balance) },
    { key: 'currency', label: 'Currency' },
  ];

  const ledgerColumns = [
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'balanceBefore', label: 'Before', render: (row) => formatCurrency(row.balanceBefore) },
    { key: 'balanceAfter', label: 'After', render: (row) => formatCurrency(row.balanceAfter) },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
  ];

  const renderWalletActions = (row) => (
    <Button variant="secondary" onClick={() => handleOpenModal(row)}>
      Adjust
    </Button>
  );

  return (
    <PageLayout title="Wallet Management">
      {error && <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }}>{error}</div>}

      <Card title="All Wallets">
        <Table 
          columns={walletColumns} 
          data={wallets}
          renderActions={renderWalletActions}
          emptyMessage="No wallets found"
        />
      </Card>

      <Modal
        isOpen={showModal}
        title={`Adjust Wallet - ${selectedWallet?.user.name}`}
        onClose={() => {
          setShowModal(false);
          setSelectedWallet(null);
          setLedgerData([]);
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <strong>Current Balance: </strong>
            {formatCurrency(selectedWallet?.balance || 0)}
          </div>

          <Select
            label="Type"
            value={adjustType}
            onChange={(e) => setAdjustType(e.target.value)}
            options={[
              { label: 'Credit', value: 'credit' },
              { label: 'Debit', value: 'debit' },
            ]}
          />

          <Input
            label="Amount"
            type="number"
            value={adjustAmount}
            onChange={(e) => setAdjustAmount(e.target.value)}
            required
          />

          <Input
            label="Description"
            value={adjustDescription}
            onChange={(e) => setAdjustDescription(e.target.value)}
            required
          />

          <Button 
            variant="primary" 
            onClick={handleAdjustWallet}
            disabled={adjusting}
          >
            {adjusting ? 'Processing...' : 'Adjust'}
          </Button>

          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <h4>Recent Ledger Entries</h4>
            <Table 
              columns={ledgerColumns} 
              data={ledgerData.slice(0, 5)}
              emptyMessage="No ledger entries"
            />
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default WalletManagementPage;

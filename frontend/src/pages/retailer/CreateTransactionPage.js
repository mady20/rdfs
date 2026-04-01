import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import axiosInstance from '../../api/axios';
import { apiErrorMessage } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { TRANSACTION_TYPES } from '../../utils/constants';

export const CreateTransactionPage = () => {
  const [formData, setFormData] = useState({
    type: '',
    customerName: '',
    customerMobile: '',
    amount: '',
    notes: '',
    deductFromWallet: false,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await axiosInstance.post('/transactions', {
        type: formData.type,
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        amount: parseFloat(formData.amount),
        notes: formData.notes,
        deductFromWallet: formData.deductFromWallet,
      });
      showToast('Transaction created successfully', { type: 'success' });
      setFormData({
        type: '',
        customerName: '',
        customerMobile: '',
        amount: '',
        notes: '',
        deductFromWallet: false,
      });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout title="Create Transaction">
      <Card>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Transaction Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={TRANSACTION_TYPES.map((t) => ({ label: t, value: t }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
            <Input
              label="Customer Mobile"
              name="customerMobile"
              value={formData.customerMobile}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="deductFromWallet"
                checked={formData.deductFromWallet}
                onChange={handleChange}
                className="h-4 w-4 text-primary rounded"
              />
              <span className="ml-3">Deduct from My Wallet</span>
            </label>
          </div>

          <div>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default CreateTransactionPage;

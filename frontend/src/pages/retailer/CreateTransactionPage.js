import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import axiosInstance from '../../api/axios';
import { apiErrorMessage } from '../../utils/helpers';
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
      alert('Transaction created successfully');
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
      <Card className="max-w-2xl mx-auto shadow-md">
        {error && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-xl mb-6 flex items-center gap-3 border border-error/20 animate-fade-in">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="Full Name"
              required
            />
            <Input
              label="Customer Mobile"
              name="customerMobile"
              value={formData.customerMobile}
              onChange={handleChange}
              placeholder="+1234567890"
              required
            />
          </div>

          <Input
            label="Amount (₹)"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <Input
            label="Notes (Optional)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional details here..."
          />

          <div className="py-3 px-1 my-2 border-t border-b border-border bg-surface-bright rounded-lg flex items-center pl-4">
            <label className="inline-flex items-center cursor-pointer">
              <div className="relative flex items-center">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  name="deductFromWallet"
                  checked={formData.deductFromWallet}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-surface-dim rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors duration-300"></div>
              </div>
              <span className="ml-3 text-sm font-semibold text-on-surface">Deduct from My Wallet</span>
            </label>
          </div>

          <div className="pt-4 mt-2 border-t border-border/50">
            <Button variant="primary" type="submit" disabled={submitting} className="w-full py-3.5 text-base">
              {submitting ? 'Processing...' : 'Complete Transaction'}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default CreateTransactionPage;

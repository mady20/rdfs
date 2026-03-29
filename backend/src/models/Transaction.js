const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  retailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  type: {
    type: String,
    enum: ['recharge', 'billpay', 'aeps', 'dmt', 'wallet_transfer', 'manual_credit', 'manual_debit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  customerName: {
    type: String,
    default: '',
  },
  customerMobile: {
    type: String,
    default: '',
  },
  referenceId: {
    type: String,
    required: true,
    unique: true,
  },
  notes: {
    type: String,
    default: '',
  },
  commissionAmount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);

const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const WalletLedger = require('../models/WalletLedger');
const User = require('../models/User');
const { ROLES, TRANSACTION_TYPES, TRANSACTION_STATUS, WALLET_LEDGER_TYPES } = require('../utils/constants');
const { validateTransaction, isPositiveNumber } = require('../utils/validators');

// Create transaction (retailer only)
const createTransaction = async (req, res) => {
  try {
    const { type, amount, customerName, customerMobile, notes, status, deductFromWallet } = req.body;

    const errors = validateTransaction({ type, amount, status });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Get distributor from retailer's parent
    const distributor = await User.findById(req.user.parentDistributor);

    const referenceId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // If deductFromWallet, check balance and deduct
    if (deductFromWallet) {
      const wallet = await Wallet.findOne({ user: req.user._id });

      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found',
        });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance',
        });
      }

      // Debit wallet
      const balanceBefore = wallet.balance;
      wallet.balance -= amount;
      wallet.updatedAt = Date.now();
      await wallet.save();

      // Create ledger entry
      await WalletLedger.create({
        user: req.user._id,
        wallet: wallet._id,
        type: WALLET_LEDGER_TYPES.DEBIT,
        amount,
        balanceBefore,
        balanceAfter: wallet.balance,
        description: `Debit for ${type} transaction`,
        createdBy: req.user._id,
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      retailer: req.user._id,
      distributor: distributor ? distributor._id : null,
      type,
      amount,
      status: status || TRANSACTION_STATUS.SUCCESS,
      customerName: customerName || '',
      customerMobile: customerMobile || '',
      referenceId,
      notes: notes || '',
      createdBy: req.user._id,
    });

    const populatedTransaction = await transaction.populate([
      { path: 'retailer', select: 'name email' },
      { path: 'distributor', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: populatedTransaction,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
    });
  }
};

// Get transactions based on role
const getTransactions = async (req, res) => {
  try {
    const { type, status } = req.query;

    let query = {};

    // Filter by role
    if (req.user.role === ROLES.RETAILER) {
      query.retailer = req.user._id;
    } else if (req.user.role === ROLES.DISTRIBUTOR) {
      // Get all retailers under this distributor
      const retailers = await User.find({ parentDistributor: req.user._id }).distinct('_id');
      query.retailer = { $in: retailers };
    }
    // ADMIN sees all transactions (no filtering on query)

    // Apply additional filters
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .populate('retailer', 'name email')
      .populate('distributor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Transactions fetched successfully',
      data: {
        items: transactions,
        total: transactions.length,
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
    });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate('retailer', 'name email')
      .populate('distributor', 'name email')
      .populate('createdBy', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Check permissions
    if (req.user.role === ROLES.RETAILER) {
      if (transaction.retailer._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    } else if (req.user.role === ROLES.DISTRIBUTOR) {
      const retailer = await User.findById(transaction.retailer._id);
      if (retailer.parentDistributor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Transaction fetched successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
    });
  }
};

// Update transaction status (admin only)
const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'success', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    transaction.status = status;
    transaction.updatedAt = Date.now();
    await transaction.save();

    const populatedTransaction = await transaction.populate([
      { path: 'retailer', select: 'name email' },
      { path: 'distributor', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Transaction status updated successfully',
      data: populatedTransaction,
    });
  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction status',
    });
  }
};

// Delete transaction (admin only)
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  deleteTransaction,
};

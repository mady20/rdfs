const User = require('../models/User');
const Wallet = require('../models/Wallet');
const WalletLedger = require('../models/WalletLedger');
const Transaction = require('../models/Transaction');
const { ROLES, WALLET_LEDGER_TYPES, TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../utils/constants');
const { validateWalletAdjustment, validateWalletTransfer, isPositiveNumber } = require('../utils/validators');

// Get my wallet
const getMyWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wallet fetched successfully',
      data: wallet,
    });
  } catch (error) {
    console.error('Get my wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet',
    });
  }
};

// Get my ledger
const getMyLedger = async (req, res) => {
  try {
    const ledger = await WalletLedger.find({ user: req.user._id })
      .populated('relatedUser', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Ledger fetched successfully',
      data: {
        items: ledger,
        total: ledger.length,
      },
    });
  } catch (error) {
    console.error('Get my ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ledger',
    });
  }
};

// Get all wallets (admin only)
const getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find()
      .populate('user', 'name email role phone isActive')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Wallets fetched successfully',
      data: {
        items: wallets,
        total: wallets.length,
      },
    });
  } catch (error) {
    console.error('Get all wallets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallets',
    });
  }
};

// Get ledger for specific user (admin only)
const getLedgerByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const ledger = await WalletLedger.find({ user: userId })
      .populate('relatedUser', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Ledger fetched successfully',
      data: {
        items: ledger,
        total: ledger.length,
      },
    });
  } catch (error) {
    console.error('Get ledger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ledger',
    });
  }
};

// Admin adjust wallet (credit/debit)
const adminAdjustWallet = async (req, res) => {
  try {
    const { targetUserId, type, amount, description } = req.body;

    const errors = validateWalletAdjustment({ targetUserId, type, amount });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const wallet = await Wallet.findOne({ user: targetUserId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    // Check balance for debit
    if (type === 'debit' && wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance',
      });
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = type === 'credit' ? wallet.balance + amount : wallet.balance - amount;

    wallet.balance = balanceAfter;
    wallet.updatedAt = Date.now();
    await wallet.save();

    // Create ledger entry
    const ledgerType = type === 'credit' ? WALLET_LEDGER_TYPES.MANUAL_CREDIT : WALLET_LEDGER_TYPES.MANUAL_DEBIT;
    const ledgerEntry = await WalletLedger.create({
      user: targetUserId,
      wallet: wallet._id,
      type: ledgerType,
      amount,
      balanceBefore,
      balanceAfter,
      description: description || `Manual ${type}`,
      createdBy: req.user._id,
    });

    // Create transaction
    const transactionType = type === 'credit' ? TRANSACTION_TYPES.MANUAL_CREDIT : TRANSACTION_TYPES.MANUAL_DEBIT;
    await Transaction.create({
      retailer: targetUserId,
      type: transactionType,
      amount,
      status: TRANSACTION_STATUS.SUCCESS,
      referenceId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
      notes: description || `Manual ${type}`,
      createdBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Wallet adjusted successfully',
      data: {
        wallet,
        ledgerEntry,
      },
    });
  } catch (error) {
    console.error('Admin adjust wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to adjust wallet',
    });
  }
};

// Transfer wallet from distributor to retailer
const transferWallet = async (req, res) => {
  try {
    const { retailerId, amount, description } = req.body;

    const errors = validateWalletTransfer({ retailerId, amount });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const retailer = await User.findById(retailerId);
    if (!retailer || retailer.role !== ROLES.RETAILER) {
      return res.status(404).json({
        success: false,
        message: 'Retailer not found',
      });
    }

    // Check if retailer belongs to distributor
    if (retailer.parentDistributor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Retailer does not belong to your organization',
      });
    }

    const distributorWallet = await Wallet.findOne({ user: req.user._id });
    const retailerWallet = await Wallet.findOne({ user: retailerId });

    if (!distributorWallet || !retailerWallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    if (distributorWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance',
      });
    }

    // Debit distributor wallet
    const distBalanceBefore = distributorWallet.balance;
    distributorWallet.balance -= amount;
    distributorWallet.updatedAt = Date.now();
    await distributorWallet.save();

    // Credit retailer wallet
    const retailerBalanceBefore = retailerWallet.balance;
    retailerWallet.balance += amount;
    retailerWallet.updatedAt = Date.now();
    await retailerWallet.save();

    // Create distributor ledger entry (transfer_out)
    await WalletLedger.create({
      user: req.user._id,
      wallet: distributorWallet._id,
      type: WALLET_LEDGER_TYPES.TRANSFER_OUT,
      amount,
      balanceBefore: distBalanceBefore,
      balanceAfter: distributorWallet.balance,
      description: description || `Transfer to ${retailer.name}`,
      relatedUser: retailerId,
      createdBy: req.user._id,
    });

    // Create retailer ledger entry (transfer_in)
    await WalletLedger.create({
      user: retailerId,
      wallet: retailerWallet._id,
      type: WALLET_LEDGER_TYPES.TRANSFER_IN,
      amount,
      balanceBefore: retailerBalanceBefore,
      balanceAfter: retailerWallet.balance,
      description: description || `Transfer from ${req.user.name}`,
      relatedUser: req.user._id,
      createdBy: req.user._id,
    });

    // Create transaction
    const referenceId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
    const transaction = await Transaction.create({
      retailer: retailerId,
      distributor: req.user._id,
      type: TRANSACTION_TYPES.WALLET_TRANSFER,
      amount,
      status: TRANSACTION_STATUS.SUCCESS,
      referenceId,
      notes: description || 'Wallet transfer',
      createdBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Wallet transferred successfully',
      data: {
        fromWalletBalance: distributorWallet.balance,
        toWalletBalance: retailerWallet.balance,
        transaction: {
          _id: transaction._id,
          type: transaction.type,
          amount: transaction.amount,
          status: transaction.status,
          referenceId: transaction.referenceId,
        },
      },
    });
  } catch (error) {
    console.error('Transfer wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transfer wallet',
    });
  }
};

module.exports = {
  getMyWallet,
  getMyLedger,
  getAllWallets,
  getLedgerByUserId,
  adminAdjustWallet,
  transferWallet,
};

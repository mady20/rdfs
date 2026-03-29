const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { ROLES } = require('../utils/constants');

// Admin dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDistributors = await User.countDocuments({ role: ROLES.DISTRIBUTOR });
    const totalRetailers = await User.countDocuments({ role: ROLES.RETAILER });

    const wallets = await Wallet.find();
    const totalWalletBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    const recentTransactions = await Transaction.find()
      .populate('retailer', 'name email')
      .populate('distributor', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'Admin dashboard fetched successfully',
      data: {
        totalUsers,
        totalDistributors,
        totalRetailers,
        totalWalletBalance,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard',
    });
  }
};

// Distributor dashboard
const getDistributorDashboard = async (req, res) => {
  try {
    const ownWallet = await Wallet.findOne({ user: req.user._id });
    const ownWalletBalance = ownWallet ? ownWallet.balance : 0;

    const retailerCount = await User.countDocuments({
      role: ROLES.RETAILER,
      parentDistributor: req.user._id,
    });

    // Get transactions of retailers under this distributor
    const retailers = await User.find({ parentDistributor: req.user._id }).distinct('_id');
    const recentRetailerTransactions = await Transaction.find({ retailer: { $in: retailers } })
      .populate('retailer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'Distributor dashboard fetched successfully',
      data: {
        ownWalletBalance,
        retailerCount,
        recentRetailerTransactions,
      },
    });
  } catch (error) {
    console.error('Get distributor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch distributor dashboard',
    });
  }
};

// Retailer dashboard
const getRetailerDashboard = async (req, res) => {
  try {
    const ownWallet = await Wallet.findOne({ user: req.user._id });
    const ownWalletBalance = ownWallet ? ownWallet.balance : 0;

    const ownTransactionCount = await Transaction.countDocuments({ retailer: req.user._id });

    const recentTransactions = await Transaction.find({ retailer: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'Retailer dashboard fetched successfully',
      data: {
        ownWalletBalance,
        ownTransactionCount,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error('Get retailer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch retailer dashboard',
    });
  }
};

module.exports = {
  getAdminDashboard,
  getDistributorDashboard,
  getRetailerDashboard,
};

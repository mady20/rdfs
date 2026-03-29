require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const WalletLedger = require('../models/WalletLedger');
const Transaction = require('../models/Transaction');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Wallet.deleteMany({});
    await WalletLedger.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Existing data cleared');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@123',
      phone: '9999999991',
      role: 'admin',
      isActive: true,
    });
    console.log('Admin created:', admin._id);

    // Create Distributor
    const distributor = await User.create({
      name: 'Distributor User',
      email: 'distributor@example.com',
      password: 'Distributor@123',
      phone: '9999999992',
      role: 'distributor',
      isActive: true,
      commissionPercent: 2.5,
      address: 'Delhi',
      createdBy: admin._id,
    });
    console.log('Distributor created:', distributor._id);

    // Create Retailer
    const retailer = await User.create({
      name: 'Retailer User',
      email: 'retailer@example.com',
      password: 'Retailer@123',
      phone: '9999999993',
      role: 'retailer',
      isActive: true,
      parentDistributor: distributor._id,
      address: 'Mumbai',
      createdBy: distributor._id,
    });
    console.log('Retailer created:', retailer._id);

    // Create wallets
    const adminWallet = await Wallet.create({
      user: admin._id,
      balance: 0,
      currency: 'INR',
    });

    const distributorWallet = await Wallet.create({
      user: distributor._id,
      balance: 10000,
      currency: 'INR',
    });

    const retailerWallet = await Wallet.create({
      user: retailer._id,
      balance: 2000,
      currency: 'INR',
    });
    console.log('Wallets created');

    // Create sample ledger entries
    await WalletLedger.create({
      user: distributor._id,
      wallet: distributorWallet._id,
      type: 'credit',
      amount: 10000,
      balanceBefore: 0,
      balanceAfter: 10000,
      description: 'Initial credit to distributor wallet',
      createdBy: admin._id,
    });

    await WalletLedger.create({
      user: retailer._id,
      wallet: retailerWallet._id,
      type: 'credit',
      amount: 2000,
      balanceBefore: 0,
      balanceAfter: 2000,
      description: 'Initial credit to retailer wallet',
      createdBy: distributor._id,
    });
    console.log('Ledger entries created');

    // Create sample transactions
    await Transaction.create({
      retailer: retailer._id,
      distributor: distributor._id,
      type: 'recharge',
      amount: 199,
      status: 'success',
      customerName: 'Amit',
      customerMobile: '9999999999',
      referenceId: 'TXN-20260329-0001',
      notes: 'Demo recharge',
      commissionAmount: 0,
      createdBy: retailer._id,
    });

    await Transaction.create({
      retailer: retailer._id,
      distributor: distributor._id,
      type: 'billpay',
      amount: 500,
      status: 'success',
      customerName: 'Rajesh',
      customerMobile: '9999999998',
      referenceId: 'TXN-20260329-0002',
      notes: 'Electricity bill payment',
      commissionAmount: 0,
      createdBy: retailer._id,
    });

    await Transaction.create({
      retailer: retailer._id,
      distributor: distributor._id,
      type: 'aeps',
      amount: 5000,
      status: 'pending',
      customerName: 'Priya',
      customerMobile: '9999999997',
      referenceId: 'TXN-20260329-0003',
      notes: 'AEPS withdrawal',
      commissionAmount: 0,
      createdBy: retailer._id,
    });
    console.log('Sample transactions created');

    console.log('Seed data completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed data error:', error);
    process.exit(1);
  }
};

seedData();

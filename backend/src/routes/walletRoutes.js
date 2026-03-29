const express = require('express');
const {
  getMyWallet,
  getMyLedger,
  getAllWallets,
  getLedgerByUserId,
  adminAdjustWallet,
  transferWallet,
} = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/my-wallet', authMiddleware, getMyWallet);
router.get('/my-ledger', authMiddleware, getMyLedger);
router.get('/all', authMiddleware, roleMiddleware(['admin']), getAllWallets);
router.get('/ledger/:userId', authMiddleware, roleMiddleware(['admin']), getLedgerByUserId);
router.post('/admin-adjust', authMiddleware, roleMiddleware(['admin']), adminAdjustWallet);
router.post('/transfer', authMiddleware, roleMiddleware(['distributor']), transferWallet);

module.exports = router;

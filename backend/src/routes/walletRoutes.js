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

// Compatibility routes for existing frontend usage
router.get('/my', authMiddleware, getMyWallet);
router.get('/my-wallet', authMiddleware, getMyWallet);
router.get('/my-ledger', authMiddleware, getMyLedger);

// Admin: list wallets
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllWallets);
router.get('/all', authMiddleware, roleMiddleware(['admin']), getAllWallets);

// Admin: ledger for a specific user
router.get('/ledger/:userId', authMiddleware, roleMiddleware(['admin']), getLedgerByUserId);

// Admin: adjust by wallet id (frontend posts to /wallets/:id/adjust)
router.post('/:id/adjust', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  req.body.targetUserId = req.params.id;
  return adminAdjustWallet(req, res);
});

// Legacy admin adjust and distributor transfer
router.post('/admin-adjust', authMiddleware, roleMiddleware(['admin']), adminAdjustWallet);
router.post('/transfer', authMiddleware, roleMiddleware(['distributor']), transferWallet);

module.exports = router;

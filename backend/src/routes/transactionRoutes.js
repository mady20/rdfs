const express = require('express');
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  deleteTransaction,
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['retailer']), createTransaction);
router.get('/', authMiddleware, getTransactions);
router.get('/:id', authMiddleware, getTransactionById);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), updateTransactionStatus);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteTransaction);

module.exports = router;

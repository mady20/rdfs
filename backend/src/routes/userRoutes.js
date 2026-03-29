const express = require('express');
const {
  createDistributor,
  createRetailer,
  getDistributors,
  getRetailers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  assignRetailerToDistributor,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Distributor routes
router.post('/distributors', authMiddleware, roleMiddleware(['admin']), createDistributor);
router.get('/distributors', authMiddleware, roleMiddleware(['admin']), getDistributors);

// Retailer routes
router.post('/retailers', authMiddleware, roleMiddleware(['admin', 'distributor']), createRetailer);
router.get('/retailers', authMiddleware, roleMiddleware(['admin', 'distributor']), getRetailers);

// User CRUD routes
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);
router.patch('/:id/status', authMiddleware, updateUserStatus);
router.patch('/:id/assign-distributor', authMiddleware, roleMiddleware(['admin']), assignRetailerToDistributor);

module.exports = router;

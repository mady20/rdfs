const express = require('express');
const {
  getAdminDashboard,
  getDistributorDashboard,
  getRetailerDashboard,
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/admin', authMiddleware, roleMiddleware(['admin']), getAdminDashboard);
router.get('/distributor', authMiddleware, roleMiddleware(['distributor']), getDistributorDashboard);
router.get('/retailer', authMiddleware, roleMiddleware(['retailer']), getRetailerDashboard);

module.exports = router;

const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Compatibility routes: frontend expects `/profile` while controllers use `/me`
router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);

router.put('/change-password', authMiddleware, changePassword);
// Compatibility: frontend sends POST for change-password in some pages
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;

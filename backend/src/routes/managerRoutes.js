const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/', managerController.create);

// Protected routes - require authentication
router.get('/profile', authMiddleware, managerController.getProfile);
router.put('/profile', authMiddleware, managerController.updateProfile);
router.put('/password', authMiddleware, managerController.changePassword);

module.exports = router;

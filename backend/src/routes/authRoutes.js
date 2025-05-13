const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/login', authController.login);
router.get('/validate-session', authMiddleware, authController.validateSession);
router.post('/logout', authMiddleware, authController.logout);
module.exports = router;
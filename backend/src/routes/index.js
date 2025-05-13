const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const managerRoutes = require('./managerRoutes');
const questionnairesRoutes = require('./questionnairesRoutes');
const campaignRoutes = require('./campaignRoutes');
const authMiddleware = require('../middleware/authMiddleware.js');


router.use('/managers', managerRoutes);
router.use('/auth', authRoutes);
router.use('/questionnaires', questionnairesRoutes);
router.use('/campaigns', authMiddleware, campaignRoutes);

module.exports = router;
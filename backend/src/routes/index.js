const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const managerRoutes = require('./managerRoutes');
const questionnairesRoutes = require('./questionnairesRoutes');

router.use('/managers', managerRoutes);
router.use('/auth', authRoutes);
router.use('/questionnaires', questionnairesRoutes);

module.exports = router;
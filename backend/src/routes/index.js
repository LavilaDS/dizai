const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const managerRoutes = require('./managerRoutes');

router.use('/managers', managerRoutes);
router.use('/auth', authRoutes);

module.exports = router;
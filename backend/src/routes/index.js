const express = require('express');
const router = express.Router();

const managerRoutes = require('./managerRoutes');

router.use('/managers', managerRoutes);

module.exports = router;
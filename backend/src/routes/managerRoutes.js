const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

router.post('/', managerController.create);

module.exports = router;

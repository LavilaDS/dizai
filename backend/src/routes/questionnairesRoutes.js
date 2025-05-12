const express = require('express');
const controller = require('../controllers/questionnairesController');
const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id/questions', controller.getQuestions);

module.exports = router;
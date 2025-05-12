const questionnairesService = require('../services/questionnairesService');

async function getAll(req, res, next) {
    try {
        const questionnaires = await questionnairesService.listAllQuestionnaires();
        res.status(200).json(questionnaires);
    } catch (err) {
        next(err);
    }
}

async function getQuestions(req, res, next) {
    try {
        const { id } = req.params;
        const questions = await questionnairesService.getQuestionsWithOptions(id);
        res.status(200).json(questions);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAll,
    getQuestions,
};
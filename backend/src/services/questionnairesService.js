const questionnairesRepository = require('../repositories/questionnairesRepository');
const AppError = require('../utils/AppError');

async function listAllQuestionnaires() {
    const questionnaires = await questionnairesRepository.getAllQuestionnaires();
    if (!questionnaires || questionnaires.length === 0) {
        throw new AppError('Nenhum questionário disponível.', 404);
    }
    return questionnaires;
}

async function getQuestionsWithOptions(questionnaireId) {
    const questions = await questionnairesRepository.getQuestionsByQuestionnaireId(questionnaireId);

    if (!questions || questions.length === 0) {
        throw new AppError('Questionário não encontrado ou não possui perguntas.', 404);
    }

    return questions;
}

module.exports = {
    listAllQuestionnaires,
    getQuestionsWithOptions,
};
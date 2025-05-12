const db = require('../config/db');

async function getAllQuestionnaires() {
  const result = await db.query(`
    SELECT q.id, q.title, q.description,
      COALESCE(
        json_agg(json_build_object('id', t.id, 'name', t.name)) 
        FILTER (WHERE t.id IS NOT NULL), '[]'
      ) AS tags
    FROM questionnaires q
    LEFT JOIN questionnaire_tags qt ON qt.questionnaire_id = q.id
    LEFT JOIN tags t ON t.id = qt.tag_id
    GROUP BY q.id
    ORDER BY q.created_at DESC
  `);
  return result.rows;
}

async function getQuestionsByQuestionnaireId(questionnaireId) {
  const questionsResult = await db.query(`
    SELECT qs.id, qs.statement, qs.response_time, qs.order_number, qs.required,
           qt.name AS question_type
    FROM questions qs
    JOIN question_types qt ON qt.id = qs.question_type
    WHERE qs.questionnaire_id = $1
    ORDER BY qs.order_number
  `, [questionnaireId]);

  const questions = [];
  for (const q of questionsResult.rows) {
    const optionsResult = await db.query(`
      SELECT id, text, order_number
      FROM answer_options
      WHERE question_id = $1
      ORDER BY order_number
    `, [q.id]);
    questions.push({
      ...q,
      options: optionsResult.rows
    });
  }
  return questions;
}

module.exports = {
  getAllQuestionnaires,
  getQuestionsByQuestionnaireId,
};
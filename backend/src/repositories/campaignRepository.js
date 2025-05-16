const pool = require('../config/db');

async function createCampaign({ managerId, questionnaireId, name, quantity, endDate }) {
  const { rows } = await pool.query(
    `INSERT INTO campaigns (manager_id, questionnaire_id, name, quantity, end_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [managerId, questionnaireId, name, quantity, endDate]
  );
  return rows[0];
}

module.exports = { createCampaign };
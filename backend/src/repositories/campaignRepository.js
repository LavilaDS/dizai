const pool = require('../config/db');

async function createCampaign({ managerId, questionnaireId, quantity, status }) {
  const { rows } = await pool.query(
    `INSERT INTO campaigns (manager_id, questionnaire_id, quantity, status) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [managerId, questionnaireId, quantity, status]
  );
  return rows[0];
}

module.exports = { createCampaign };
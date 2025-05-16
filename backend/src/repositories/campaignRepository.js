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

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
  return rows[0];
}

async function updateStatus(id, status) {
  const { rows } = await pool.query('UPDATE campaigns SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  return rows[0];
}

module.exports = { createCampaign, findById, updateStatus };
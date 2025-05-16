const pool = require('../config/db');

async function addParticipants(participants) {
  if (!participants || participants.length === 0) return [];

  const values = [];
  const placeholders = participants.map((p, i) => {
    const baseIndex = i * 4;
    values.push(p.campaign_id, p.email, p.phone, p.token);
    return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`;
  }).join(', ');

  const query = `
    INSERT INTO participants (campaign_id, email, phone, token)
    VALUES ${placeholders}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM participants WHERE id = $1', [id]);
  return rows[0];
}

async function updateStatus(id, status) {
  const { rows } = await pool.query('UPDATE participants SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  return rows[0];
}

module.exports = { addParticipants, findById, updateStatus };

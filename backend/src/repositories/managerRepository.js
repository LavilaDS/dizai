const pool = require('../config/db');

async function create({name, email, password_hash }) {
  const { rows } = await pool.query(
    'INSERT INTO managers (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, password_hash]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM managers WHERE email = $1', [email]);
  return rows[0];
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM managers WHERE id = $1', [id]);
  return rows[0];
}

async function update(id, { name, email }) {
  const updateFields = [];
  const values = [];
  let paramCount = 1;
  
  if (name) {
    updateFields.push(`name = $${paramCount}`);
    values.push(name);
    paramCount++;
  }
  
  if (email) {
    updateFields.push(`email = $${paramCount}`);
    values.push(email);
    paramCount++;
  }
  
  // Always update the updated_at timestamp
  updateFields.push(`updated_at = NOW()`);
  
  // Add the ID as the last parameter
  values.push(id);
  
  const { rows } = await pool.query(
    `UPDATE managers SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );
  
  return rows[0];
}

async function updatePassword(id, passwordHash) {
  const { rows } = await pool.query(
    'UPDATE managers SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email',
    [passwordHash, id]
  );
  
  return rows[0];
}

module.exports = { create, findByEmail, findById, update, updatePassword };

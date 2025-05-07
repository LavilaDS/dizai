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

module.exports = { create, findByEmail };

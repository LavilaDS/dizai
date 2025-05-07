const pool = require('../config/db');

async function findByCnpj(cnpj) {
  const { rows } = await pool.query('SELECT id FROM companies WHERE cnpj = $1', [cnpj]);
  return rows[0];
}

async function create({manager_id, name, cnpj }) {
  const { rows } = await pool.query(
    'INSERT INTO companies (manager_id, name, cnpj) VALUES ($1, $2, $3) RETURNING id',
    [manager_id, name, cnpj]
  );
  return rows[0];
}

module.exports = { findByCnpj, create };

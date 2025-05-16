const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { env } = require('../config');
const managerRepository = require('../repositories/managerRepository');

async function login(email, password) {
  // Verifica se o email e a senha foram fornecidos
  if (!email || !password) {
      throw new AppError('Email e senha são obrigatórios', 400);
  }
  // Busca o gerente pelo email
  const manager = await managerRepository.findByEmail(email);
  if (!manager) {
      throw new AppError('Credenciais inválidas', 401);
  }
  const validPassword = await bcrypt.compare(password, manager.password_hash);
  if (!validPassword) {
      throw new AppError('Credenciais inválidas', 401);
  }
  // Gera o token JWT
  const token = jwt.sign({ id: manager.id, email: manager.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  const refreshToken = jwt.sign({ id: manager.id, email: manager.email }, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
  return { refreshToken, token, manager: { id: manager.id, name: manager.name, email: manager.email } };
}

async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError('Refresh token não fornecido', 401);
  }

  try {
    const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);

    if (!decoded?.id || !decoded?.email) {
      throw new AppError('Refresh token inválido ou malformado', 401);
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return {
      token: newAccessToken,
      manager: { id: decoded.id, email: decoded.email }
    };
  } catch (err) {
    throw new AppError('Refresh token inválido ou expirado', 401);
  }
}

// Futuras funções: logout, refreshToken, etc.
// async function logout() { ... }
// async function refreshToken() { ... }

module.exports = { 
    login,
    refreshAccessToken
};
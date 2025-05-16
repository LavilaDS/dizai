const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwtUtils');
const { comparePassword } = require('../utils/bcryptUtils');
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
  const validPassword = await comparePassword(password, manager.password_hash);
  if (!validPassword) {
      throw new AppError('Credenciais inválidas', 401);
  }
  // Gera o token JWT
  const token = signAccessToken({ id: manager.id, email: manager.email });
  const refreshToken = signRefreshToken({ id: manager.id }); // Removido email do refresh token
  return { refreshToken, token, manager: { id: manager.id, name: manager.name, email: manager.email } };
}

async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError('Refresh token não fornecido', 401);
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded?.id) {
      throw new AppError('Refresh token inválido ou malformado', 401);
    }

    // Busca os dados do gerente no banco de dados
    const manager = await managerRepository.findById(decoded.id);
    if (!manager) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const newAccessToken = signAccessToken({ id: manager.id }); // Não inclui dados pessoais no payload do access token

    return {
      token: newAccessToken,
      manager: { id: manager.id, name: manager.name, email: manager.email },
    };
  } catch (err) {
    throw new AppError('Refresh token inválido ou expirado', 401);
  }
}

module.exports = { 
    login,
    refreshAccessToken
};
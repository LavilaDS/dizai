const jwt = require('jsonwebtoken');
const { env } = require('../config');
const SECRET = env.jwtSecret
const AppError = require('../utils/AppError');

function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    throw new AppError('Token não fornecido.', 401);
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    throw new AppError('Token inválido.', 401);
  }
}

module.exports = authenticateUser;
const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  console.log(err)
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Erro interno do servidor.';
  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;

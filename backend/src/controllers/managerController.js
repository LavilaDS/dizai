const managerService = require('../services/managerService');
const AppError = require('../utils/AppError');

async function create(req, res, next) {
  try {
    const { name, email, password, company_name, company_cnpj } = req.body;
    if (!name || !email || !password || !company_name || !company_cnpj) {
      throw new AppError('Dados obrigatórios não informados.', 400);
    }
    const manager = await managerService.create({ name, email, password, company_name, company_cnpj });
    res.status(201).json({ manager });
  } catch (error) {
    next(error);
  }
}

module.exports = { create };

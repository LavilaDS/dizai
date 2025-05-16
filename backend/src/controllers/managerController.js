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

async function getProfile(req, res, next) {
  try {
    const managerId = req.user.id;
    const manager = await managerService.getById(managerId);
    
    if (!manager) {
      throw new AppError('Gestor não encontrado', 404);
    }
    
    delete manager.password_hash;
    
    res.status(200).json(manager);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const managerId = req.user.id;
    const { name, email } = req.body;
    
    if (!name && !email) {
      throw new AppError('Nenhum dado para atualizar', 400);
    }
    
    const updatedManager = await managerService.updateProfile(managerId, { name, email });

    res.cookie('token', updatedManager.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({name: updatedManager.name, email: updatedManager.email});
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const managerId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      throw new AppError('Senha atual e nova senha são obrigatórias', 400);
    }
    
    await managerService.changePassword(managerId, currentPassword, newPassword);
    
    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  create,
  getProfile,
  updateProfile,
  changePassword
};

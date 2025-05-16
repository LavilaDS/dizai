const companyRepository = require('../repositories/companyRepository');
const managerRepository = require('../repositories/managerRepository');
const { hashPassword, comparePassword } = require('../utils/bcryptUtils');
const { signAccessToken } = require('../utils/jwtUtils');
const { env } = require('../config');
const AppError = require('../utils/AppError');
const validationUtils = require('../utils/validationUtils');

async function create({ name, email, password, company_name, company_cnpj }) {
  if (!validationUtils._validateName(name)) {
    throw new AppError('Nome inválido.', 400);
  }
  if (!validationUtils._validateEmail(email)) {
    throw new AppError('E-mail inválido.', 400);
  }
  if (!validationUtils._validatePassword(password)) {
    throw new AppError('Senha inválida.', 400);
  }
  if (!validationUtils._validateCompanyName(company_name)) {
    throw new AppError('Nome da empresa inválido.', 400);
  }
  if (!validationUtils._validateCompanyCNPJ(company_cnpj)) {
    throw new AppError('CNPJ inválido.', 400);
  }

  const existingManager = await managerRepository.findByEmail(email);
  if (existingManager) {
    throw new AppError('E-mail já cadastrado.', 409);
  }

  let company = await companyRepository.findByCnpj(company_cnpj);
  if (company) {
    throw new AppError('CNPJ já cadastrado.', 409);
  }

  const passwordHash = await hashPassword(password);
  const manager = await managerRepository.create({
    name,
    email,
    password_hash: passwordHash,
  });

  company = await companyRepository.create({
    manager_id: manager.id,
    name: company_name,
    cnpj: company_cnpj,
  });

  return { ...manager, company_id: company.id };
}

async function getById(id) {
  const manager = await managerRepository.findById(id);
  
  if (!manager) {
    throw new AppError('Gestor não encontrado', 404);
  }
  
  return manager;
}

async function updateProfile(id, { name, email }) {
  if (name && !validationUtils._validateName(name)) {
    throw new AppError('Nome inválido.', 400);
  }
  if (email && !validationUtils._validateEmail(email)) {
    throw new AppError('E-mail inválido.', 400);
  }

  const manager = await managerRepository.findById(id);
  
  if (!manager) {
    throw new AppError('Gestor não encontrado', 404);
  }
  
  if (email && email !== manager.email) {
    const existingManager = await managerRepository.findByEmail(email);
    
    if (existingManager) {
      throw new AppError('E-mail já está em uso', 409);
    }
  }
  
  const updatedManager = await managerRepository.update(id, { name, email });

  const newToken = signAccessToken({ id: updatedManager.id });

  return {name: updatedManager.name, email:updatedManager.email, token: newToken };
}

async function changePassword(id, currentPassword, newPassword) {
  if (!validationUtils._validatePassword(newPassword)) {
    throw new AppError('Nova senha inválida.', 400);
  }

  const manager = await managerRepository.findById(id);
  
  if (!manager) {
    throw new AppError('Gestor não encontrado', 404);
  }
  
  const isPasswordValid = await comparePassword(currentPassword, manager.password_hash);
  
  if (!isPasswordValid) {
    throw new AppError('Senha atual incorreta', 401);
  }
  
  const newPasswordHash = await hashPassword(newPassword);
  
  await managerRepository.updatePassword(id, newPasswordHash);
  
  return true;
}

module.exports = { 
  create,
  getById,
  updateProfile,
  changePassword
};

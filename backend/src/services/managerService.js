const companyRepository = require('../repositories/companyRepository');
const managerRepository = require('../repositories/managerRepository');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');

async function create({ name, email, password, company_name, company_cnpj }) {
  
  const existingManager = await managerRepository.findByEmail(email);
  if (existingManager) {
  throw new AppError('E-mail já cadastrado.', 409);
  }

  let company = await companyRepository.findByCnpj(company_cnpj);
  if (company) {
  throw new AppError('CNPJ já cadastrado.', 409);
  } 

  // Create manager
  const passwordHash = await bcrypt.hash(password, 10);
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

  return { ...manager, "company_id": company.id};
}

module.exports = { create };

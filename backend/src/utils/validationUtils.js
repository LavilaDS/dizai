const AppError = require('./AppError');

function _validateName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && /^[A-ZÀ-ÿ\s'-]+$/i.test(trimmedName);
}

function _validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

function _validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const normalized = phone.replace(/[\s\-().]/g, '');
  const e164 = /^\+?[1-9]\d{1,14}$/;
  return e164.test(normalized);
}

function _validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function _validateCompanyName(companyName) {
  if (!companyName || typeof companyName !== 'string') return false;
  const trimmedName = companyName.trim();
  return trimmedName.length >= 2 && /^[A-ZÀ-ÿ0-9\s'-]+$/i.test(trimmedName);
}

function _validateCompanyCNPJ(cnpj) {
  if (!cnpj || typeof cnpj !== 'string') return false;
  const cleanedCNPJ = cnpj.replace(/\D/g, '');
  if (cleanedCNPJ.length !== 14) return false;

  let size = cleanedCNPJ.length - 2;
  let numbers = cleanedCNPJ.substring(0, size);
  let digits = cleanedCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) return false;

  size += 1;
  numbers = cleanedCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1), 10);
}

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// New consolidated function for ID validation
function validateIdAsUuid(id, idOwnerName) {
  if (!id || typeof id !== 'string' || !UUID_REGEX.test(id)) {
    throw new AppError(`ID ${idOwnerName} inválido. Deve estar no formato UUID.`, 400);
  }
  return true;
}

function validateDate(dateString) {
  if (!dateString) {
    throw new AppError('Data final da campanha não informada.', 400);
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new AppError('Formato de data inválido. Utilize o formato YYYY-MM-DD ou um formato reconhecível.', 400);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Compare dates only, not time
  console.log(today, date);
  if (date < today) {
    throw new AppError('A data final da campanha deve ser uma data futura.', 400);
  }
  return true;
}

function validateCampaignName(campaignName) {
  if (!campaignName || typeof campaignName !== 'string' || campaignName.trim().length < 2 || campaignName.trim().length > 50) {
    throw new AppError('Nome da campanha inválido. Deve ter entre 2 e 50 caracteres.', 400);
  }
  return true;
}

function validateContacts(contacts) {
  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    throw new AppError('A lista de contatos não pode estar vazia.', 400);
  }

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (!contact || typeof contact !== 'object') {
      throw new AppError(`Contato inválido na posição ${i + 1}. Formato incorreto.`, 400);
    }

    if (!_validateName(contact.name)) {
      throw new AppError(`Nome inválido para o contato '${contact.email || ''}': '${contact.name || ''}'. O nome deve ter pelo menos 2 caracteres e conter apenas letras, espaços, hífens ou apóstrofos.`, 400);
    }
    if (!_validateEmail(contact.email)) {
      throw new AppError(`Email inválido para o contato '${contact.name || ''}': '${contact.email || ''}'.`, 400);
    }
    if (contact.phone && !_validatePhoneNumber(contact.phone)) {
      throw new AppError(`Número de telefone inválido para o contato '${contact.name || ''}': '${contact.phone || ''}'.`, 400);
    }
  }
  return true;
}

module.exports = {
  validateIdAsUuid, // Replaces validateManagerId and validateQuestionnaireId
  validateDate,
  validateCampaignName,
  validateContacts,
  _validateName,
  _validateEmail,
  _validatePhoneNumber,
  _validatePassword,
  _validateCompanyName,
  _validateCompanyCNPJ,
};

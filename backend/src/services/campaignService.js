const campaignRepository = require('../repositories/campaignRepository');
const participantRepository = require('../repositories/participantRepository');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');
const {
  validateIdAsUuid, // Updated to use the new function
  validateDate,
  validateCampaignName,
  validateContacts
} = require('../utils/validationUtils');

async function createCampaign({ managerId, questionnaireId, campaignName, endDate, contacts }) {
  validateIdAsUuid(managerId, 'do gestor'); // Updated to use the new function
  validateIdAsUuid(questionnaireId, 'do questionário'); // Updated to use the new function
  validateCampaignName(campaignName);
  validateDate(endDate);
  validateContacts(contacts);


  const campaign = await campaignRepository.createCampaign({
    managerId,
    questionnaireId,
    name: campaignName,
    quantity: contacts.length,
    endDate,
  });

  const participants = contacts.map(contact => ({
    campaign_id: campaign.id,
    email: contact.email,
    phone: contact.phone || null,
    token: uuidv4(),
  }));

  await participantRepository.addParticipants(participants);

  return campaign;
}

module.exports = { createCampaign };
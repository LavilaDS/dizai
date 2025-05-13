const campaignRepository = require('../repositories/campaignRepository');
const participantRepository = require('../repositories/participantRepository');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');

async function createCampaign({ managerId, questionnaireId, contacts }) {
  if (!managerId || !questionnaireId || !contacts || contacts.length === 0) {
    throw new AppError('Dados necessários não fornecidos', 400);
  }

  // Create the campaign
  const campaign = await campaignRepository.createCampaign({
    managerId,
    questionnaireId,
    quantity: contacts.length,
    status: 'ATIVA',
  });

  // Create the participants
  const participants = contacts.map(contact => ({
    campaign_id: campaign.id,
    email: contact.email,
    phone: contact.phone || null,
    token: uuidv4(), // Generate unique token for each participant
    status: 'PENDENTE',
  }));

  await participantRepository.addParticipants(participants);

  return campaign;
}

module.exports = { createCampaign };
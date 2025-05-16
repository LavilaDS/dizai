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
const emailQueue = require('../queues/emailQueue');
const { addDays, addHours, setHours, setMinutes, setSeconds, isBefore } = require('date-fns');

async function scheduleRemindersForParticipant(participant, campaign) {
  const now = new Date();
  const endDate = new Date(campaign.end_date);

  // 1. Agendar lembretes diários
  let nextDay = setHours(setMinutes(setSeconds(now, 0), 0), 8); // Começa amanhã às 08:00
  if (isBefore(nextDay, now)) nextDay = addDays(nextDay, 1);

  while (isBefore(nextDay, endDate)) {
    // Horário aleatório entre 08:00 e 11:00
    const randomHour = 8 + Math.floor(Math.random() * 4); // 8, 9, 10, 11
    const randomMinute = Math.floor(Math.random() * 60);
    const sendTime = setHours(setMinutes(new Date(nextDay), randomMinute), randomHour);

    await emailQueue.add('daily-reminder', {
      participantId: participant.id,
      campaignId: campaign.id,
      type: 'daily'
    }, { jobId: `daily-${participant.id}-${sendTime.toISOString()}`, delay: sendTime - now });
    nextDay = addDays(nextDay, 1);
  }

  // 2. Lembretes especiais (12h, 6h, 3h antes do fim)
  [12, 6, 3].forEach(async (hoursBefore) => {
    const reminderTime = addHours(endDate, -hoursBefore);
    if (isBefore(now, reminderTime)) {
      await emailQueue.add('special-reminder', {
        participantId: participant.id,
        campaignId: campaign.id,
        hoursBefore,
        type: 'special'
      }, { jobId: `special-${hoursBefore}h-${participant.id}-${campaign.id}`, delay: reminderTime - now });
    }
  });
}

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

  const insertedParticipants = await participantRepository.addParticipants(participants);

  // Agendar lembretes para cada participante
  for (const participant of insertedParticipants) {
    await scheduleRemindersForParticipant(participant, campaign);
  }

  return campaign;
}

module.exports = { createCampaign };
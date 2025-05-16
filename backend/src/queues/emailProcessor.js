const emailQueue = require('./emailQueue');
const { getParticipant, getCampaign, sendEmail } = require('../services/emailService');

emailQueue.process('daily-reminder', async (job) => {
  const { participantId, campaignId } = job.data;
  const participant = await getParticipant(participantId);
  const campaign = await getCampaign(campaignId);

  if (!participant || !campaign) return;
  if (participant.status !== 'PENDENTE') return;
  if (campaign.status !== 'ATIVA') return;
  if (new Date() > new Date(campaign.end_date)) return;

  await sendEmail(participant.email, 'Lembrete: Responda sua pesquisa', 'Você ainda não respondeu sua pesquisa. Participe!');
});

emailQueue.process('special-reminder', async (job) => {
  const { participantId, campaignId, hoursBefore } = job.data;
  const participant = await getParticipant(participantId);
  const campaign = await getCampaign(campaignId);

  if (!participant || !campaign) return;
  if (participant.status !== 'PENDENTE') return;
  if (campaign.status !== 'ATIVA') return;
  if (new Date() > new Date(campaign.end_date)) return;

  const msg = `Faltam ${hoursBefore} horas para encerrar sua participação!`;
  await sendEmail(participant.email, 'Última chance!', msg);
});

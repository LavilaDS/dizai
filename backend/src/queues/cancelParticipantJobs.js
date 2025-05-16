const emailQueue = require('./emailQueue');

async function cancelParticipantJobs(participantId, campaignId) {
  // Remove jobs agendados (não repeatable)
  const waiting = await emailQueue.getWaiting();
  for (const job of waiting) {
    if (job.data.participantId === participantId && job.data.campaignId === campaignId) {
      await job.remove();
    }
  }
  // Remove jobs agendados que ainda não entraram na fila
  const delayed = await emailQueue.getDelayed();
  for (const job of delayed) {
    if (job.data.participantId === participantId && job.data.campaignId === campaignId) {
      await job.remove();
    }
  }
}

module.exports = cancelParticipantJobs;

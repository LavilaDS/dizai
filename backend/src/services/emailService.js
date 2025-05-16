// Funções mock para exemplo. Implemente integração real com seu sistema de e-mail e banco de dados.
const participantRepository = require('../repositories/participantRepository');
const campaignRepository = require('../repositories/campaignRepository');

async function getParticipant(participantId) {
  return participantRepository.findById(participantId);
}

async function getCampaign(campaignId) {
  return campaignRepository.findById(campaignId);
}

const nodemailer = require('nodemailer');

// Configure o transporter com seu serviço SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou 'hotmail', 'outlook', etc.
  auth: {
    user: process.env.SMTP_USER, // Seu e-mail
    pass: process.env.SMTP_PASS  // Sua senha ou app password
  }
});



async function sendEmail(to, subject, body) {
  // Implemente aqui a integração real com seu serviço de e-mail
  console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
  return true;
}

module.exports = {
  getParticipant,
  getCampaign,
  sendEmail
};

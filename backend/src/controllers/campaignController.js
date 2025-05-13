const campaignService = require('../services/campaignService');

async function create(req, res, next) {
  try {
    const {questionnaireId, contacts } = req.body;

    const managerId = req.user.id;
    const campaign = await campaignService.createCampaign({
      managerId,
      questionnaireId,
      contacts,
    });

    res.status(201).json({ campaign });
  } catch (error) {
    next(error);
  }
}

module.exports = { create };
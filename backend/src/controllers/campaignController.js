const campaignService = require('../services/campaignService');

async function create(req, res, next) {
  try {
    const { questionnaireId, campaignName, endDate, contacts } = req.body;

    const managerId = req.user.id;
    const campaign = await campaignService.createCampaign({
      managerId,
      questionnaireId,
      campaignName,
      endDate,
      contacts,
    });

    res.status(201).json({ campaign });
  } catch (error) {
    next(error);
  }
}

module.exports = { create };
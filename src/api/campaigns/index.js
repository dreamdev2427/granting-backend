const express = require('express');
const router = express.Router();
const campaign = require("./controller");

router.post('/create', campaign.createCampaign);
router.post('/all', campaign.getAll);
router.post('/getOne', campaign.getOne);

router.get('/getCampaignCounts', campaign.getCampaignCounts);
router.post('/delete', campaign.deleteOne);
router.post('/deleteByAdmin', campaign.deleteByAdmin);
router.post('/getCampaignCountsOfUser', campaign.getCampaignCountsOfUser);
router.post('/getCampaignsOfUser', campaign.getCampaignsOfUser);
router.post('/update', campaign.update);

module.exports = router;

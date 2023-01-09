const express = require('express');
const router = express.Router();
const campaign = require("./controller");

router.post('/create', campaign.createCampaign);
router.post('/all', campaign.getAll);
router.post('/getOne', campaign.getOne);
router.post('/getByLimit', campaign.getByLimit);

router.get('/getCampaignCounts', campaign.getCampaignCounts);
router.post('/delete', campaign.deleteOne);
router.post('/deleteByAdmin', campaign.deleteByAdmin);
router.post('/getCampaignCountsOfUser', campaign.getCampaignCountsOfUser);
router.post('/getCampaignsOfUser', campaign.getCampaignsOfUser);
router.post('/update', campaign.update);
router.post('/getByLimitForAdmin', campaign.getByLimitForAdmin);
router.post('/getTotalCountOfKywordSearchForAdmin', campaign.getTotalCountOfKywordSearchForAdmin);

module.exports = router;

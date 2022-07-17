const express = require('express');
const router = express.Router();
const donation = require("./controller");

router.post('/create', donation.createDonation);
router.post('/all', donation.getAll);
router.post('/delete', donation.deleteOne);
router.post('/getDonationCountsOfUser', donation.getDonationCountsOfUser);
router.post('/getTotalDonatedAmountsOfUser', donation.getTotalDonatedAmountsOfUser);
router.post('/getDonationsOfUser', donation.getDonationsOfUser);

module.exports = router;

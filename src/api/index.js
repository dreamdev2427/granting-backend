const express = require('express');

const donations = require('./donations');
const likes = require("./likes");
const campaigns = require("./campaigns");
const nativePrices = require("./nativePrices");
const utils = require('./utils');

const router = express.Router();

router.use('/donation', donations);
router.use('/likes', likes);
router.use("/campaign",  campaigns);
router.use("/nativePrices",  nativePrices);
router.use('/utils', utils);

module.exports = router;

const express = require('express');

const donations = require('./donations');
const likes = require("./likes");
const campaigns = require("./campaigns");
const nativePrices = require("./nativePrices");
const utils = require('./utils');
const generalOptions = require("./generalOptions");
const opRewards = require("./opRewards");

const router = express.Router();

router.use('/donation', donations);
router.use('/likes', likes);
router.use("/campaign",  campaigns);
router.use("/nativePrices",  nativePrices);
router.use('/utils', utils);
router.use('/generalOptions', generalOptions);
router.use('/opRewards', opRewards);

module.exports = router;

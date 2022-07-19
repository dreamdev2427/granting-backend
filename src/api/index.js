const express = require('express');

const donations = require('./donations');
const likes = require("./likes");
const campaigns = require("./campaigns");
const nativePrices = require("./nativePrices");
const checkAuthentication = require('./private_router');

const router = express.Router();

router.use('/donation', checkAuthentication, donations);
router.use('/likes', checkAuthentication, likes);
router.use("/campaign",  campaigns);
router.use("/nativePrices",  nativePrices);

module.exports = router;

const express = require('express');

const donations = require('./donations');
const likes = require("./likes");
const campaigns = require("./campaigns");
const checkAuthentication = require('./private_router');

const router = express.Router();

router.use('/donation', checkAuthentication, donations);
router.use('/likes', checkAuthentication, likes);
router.use("/campaign",  campaigns);

module.exports = router;

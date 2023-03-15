const express = require('express');
const router = express.Router();
const opRewards = require("./controller");

router.post('/create', opRewards.create);
router.post('/all', opRewards.getAll);
router.post('/delete', opRewards.deleteOne);
router.post('/getOpRewardsOfUser', opRewards.getOpRewardsOfUser);
router.post('/getStatisticPerChain', opRewards.getStatisticPerChain);

module.exports = router;

const express = require('express');
const router = express.Router();
const GeneralOptions = require("./controller");

router.post('/set', GeneralOptions.setGeneralOptions);
router.post('/get', GeneralOptions.getAll);

module.exports = router;

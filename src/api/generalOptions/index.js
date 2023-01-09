const express = require('express');
const router = express.Router();
const GeneralOptions = require("./controller");

router.post('/set', GeneralOptions.setGeneralOptions);
router.get('/get', GeneralOptions.getAll);
router.post('/isAdmin', GeneralOptions.isAdmin);

module.exports = router;

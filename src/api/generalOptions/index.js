const express = require('express');
const router = express.Router();
const GeneralOptions = require("./controller");

router.post('/set', GeneralOptions.setGeneralOptions);
router.get('/get', GeneralOptions.getAll);
router.post('/isAdmin', GeneralOptions.isAdmin);
router.post('/setNewWallet', GeneralOptions.setNewWallet);

module.exports = router;

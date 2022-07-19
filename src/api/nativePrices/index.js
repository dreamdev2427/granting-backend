const express = require('express');
const router = express.Router();
const Likes = require("./controller");

router.post('/set', Likes.setPrice);
router.post('/all', Likes.getAll);
router.post('/getOne', Likes.getOne);
router.post('/delete', Likes.deleteOne);

module.exports = router;

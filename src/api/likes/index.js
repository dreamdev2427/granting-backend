const express = require('express');
const router = express.Router();
const Likes = require("./controller");

router.post('/set', Likes.setLikes);
router.post('/all', Likes.getAll);
router.post('/delete', Likes.deleteOne);
router.post('/getAllLikedCampaigns', Likes.getAllLikedCampaigns);

module.exports = router;

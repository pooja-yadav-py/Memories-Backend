const express = require("express");
const router = express.Router();
const tokenVerifty = require('./authorization');
const {LikeMemory,getTotalLikesForMemory} = require('../controller/likeMemoryController');

router.post("/likememory",tokenVerifty, LikeMemory);
router.get("/countlikememory",tokenVerifty,getTotalLikesForMemory);
module.exports = router;
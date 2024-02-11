const express = require("express");
const router = express.Router();
const tokenVerifty = require('./authorization');
const {LikeMemory,getTotalLikesForMemory,memoryLikeUser} = require('../controller/likeMemoryController');

router.post("/likememory",tokenVerifty, LikeMemory);
router.get("/countlikememory",tokenVerifty,getTotalLikesForMemory);
router.post("/likeUsers", tokenVerifty, memoryLikeUser)
module.exports = router;
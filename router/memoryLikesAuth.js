const express = require("express");
const router = express.Router();
const tokenVerifty = require('./authorization');
const {getTotalLikesForMemory,memoryLikeUser} = require('../controller/likeMemoryController');

router.get("/countlikememory",tokenVerifty,getTotalLikesForMemory);
router.post("/likeUsers", tokenVerifty, memoryLikeUser)
module.exports = router;
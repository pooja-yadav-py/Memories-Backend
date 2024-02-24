const express = require("express");
const router = express.Router();
const tokenVerifty = require('./authorization');

const {createMemory,getAllMemory,deleteMemory,updateMemory,likeMemory,userLikeMemory,getMemoryHistory,getLikeMemoryHistory} = require('../controller/memoryController');

//create Memory
router.post("/creatememory", tokenVerifty, createMemory)

//get Memory
router.get("/memories", tokenVerifty, getAllMemory)

//delete memory
router.delete("/deletememory/:id", tokenVerifty, deleteMemory)

//update memory
router.put("/updatememory", tokenVerifty, updateMemory)

//like memory
router.post("/likememory", tokenVerifty, likeMemory)

//userLikeMemory
router.get("/userlikememory", tokenVerifty, userLikeMemory)

router.get("/memory/report/daywise", tokenVerifty, getMemoryHistory)

router.get("/memory/likereport/daywise", tokenVerifty, getLikeMemoryHistory)


module.exports = router;

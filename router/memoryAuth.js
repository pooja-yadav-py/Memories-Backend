const express = require("express");
const router = express.Router();
const tokenVerifty = require('./authorization');

const {createMemory,getAllMemory,deleteMemory,updateMemory,likeMemory,userLikeMemory,memoriesHistory} = require('../controller/memoryController');

//create Memory
router.post("/creatememory", tokenVerifty, createMemory)

//get usermemories
// router.get("/usermemories", tokenVerifty, getAllMemory)

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

//userLikeMemory
router.get("/create-memory-chart", tokenVerifty, memoriesHistory)


module.exports = router;

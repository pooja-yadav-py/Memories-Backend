const express = require("express");
const router = express.Router();
const tokenVerifty = require('./authorization');

const {createMemory,getUserMemory,getAllMemory,deleteMemory,updateMemory,likeMemory,userLikeMemory} =require('../controller/memoryController');
//create Memory
router.post("/creatememory", tokenVerifty, createMemory)

//get usermemories
router.get("/usermemories", tokenVerifty, getUserMemory)

//get Memory
router.get("/memories", tokenVerifty, getAllMemory)

//delete memory
router.delete("/deletememory/:id", tokenVerifty, deleteMemory)

//update memory
router.put("/updatememory", tokenVerifty,updateMemory)

//like memory
router.post("/likememory",tokenVerifty, likeMemory);

//userLikeMemory
router.get("/userlikememory",tokenVerifty, userLikeMemory);


module.exports = router;

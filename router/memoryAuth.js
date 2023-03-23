const express = require("express");
const router = express.Router();
const tokenVerifty = require('./authorization');

const {createMemory,getUserMemory,getAllMemory,deleteMemory,updateMemory} =require('../controller/memoryController');
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


module.exports = router;

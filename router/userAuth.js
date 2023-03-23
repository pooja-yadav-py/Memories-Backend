const express = require("express");
const router = express.Router();
// const auth = require('./authorization');
const tokenVerifty = require('./authorization');
const {userResistor,userLogin,getAllUser,deleteUser,updateUser,forgetPassword,resetPassword} = require('../controller/userController');

//signup route
router.post('/resister', userResistor);

//login route
router.post("/loginuser", userLogin);

//get userData route
// router.get("/userData",tokenVerifty,getUserData);

//get all user
router.get("/userslist", tokenVerifty, getAllUser);

//delete user
router.delete("/deleteuser/:id", tokenVerifty, deleteUser);

//update user
router.put("/updateuser", tokenVerifty, updateUser);

//forget-password
router.post("/forgetpassword", forgetPassword);

//resetPassword
router.post("/resetpassword", resetPassword);

module.exports = router;
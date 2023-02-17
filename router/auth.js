const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')
const JWT_SECRFT = process.env.ACCESS_TOKEN_SECRET
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
sgMail.setApiKey("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");


//signup route
router.post('/resister', async (req, res) => {
    const { username, email, password, gender } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)
    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send({ success: "false", message: "User Already Exists" });
        }
        await User.create({
            uname: username,
            email,
            password: encryptedPassword,
            gender,
        })
        res.send({ success: true, message: "you are Resistor successfully" })
    } catch (error) {        
        res.send({ success: false, message: "some issue please try again" })
    }
})

//login route
router.post("/loginuser", async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });    
    if (!user) {
        return res.send({ success: false, message: "User not Exist" })
    }
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, JWT_SECRFT, { expiresIn: 100000, })

        if (token) {
            return res.send({ success: true, data: token });
        } else {
            return res.send({ success: false, message: "Error while login" })
        }
    }
    res.json({ success: false, message: "Invalid Password" });
})

//get userData route
router.get("/userData", async (req, res) => {
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader.split(" ")[1];
    try {
        const user = jwt.verify(token, JWT_SECRFT, (err, res) => {
            if (err) {
                return "token Expired";
            }
            return res;
        });
        
        if (user == "token Expired") {
            return res.send({ status: "error", data: "Token Expired" });
        }
        const useremail = user.email;
        User.findOne({ email: useremail })
            .then((data) => {                
                res.send({ status: "ok", data: data });
            }).catch((error) => {
                res.send({ status: "error", data: error });
            })
    } catch (e) {
        res.send({ status: e })
    }
})

//forget-password
router.post("/forgetpassword", async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.send("User Not Exists!!")
        } else {
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'kumarbasant229@gmail.com',
                    pass: 'dmhihezwbiktsckt'
                }
            });
            let mailDetails = {
                from: 'basantkumaralwar@gmail.com',
                to: 'mispooju@gmail.com',
                subject: 'Test mail',
                html: `<a href="http://localhost:3000/resetpassword/${oldUser._id}">Confirm</a>`
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {                
                if (err) {
                    console.log('Error Occurs');
                } else {
                    console.log('Email sent successfully');
                }
            });
            oldUser._id
            return res.send({ success: true, message: 'Password reset email has been sent.', data: oldUser._id })
        }
    } catch (error) {
        res.send({ success: false, message: 'error' });
    }
})

//resetPassword
router.post("/resetpassword", async (req, res) => {
    const { id, password } = req.body;
    try {
        let finduser = await User.findOne({ _id: id });
        if (!finduser) {
            return res.send({ success: false, message: "User not Exist" });
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        let updateuser = await User.updateOne({ _id: id }, { password: encryptedPassword });
        if (updateuser.modifiedCount == 1) {
            return res.send({ success: true, message: "your Password Updated!" });
        }
        else {
            return res.send({ success: false, message: "Not update your Password" });
        }
    } catch (error) {
        return res.send({ success: false, message: "User not Exist" });
    }
})

module.exports = router;

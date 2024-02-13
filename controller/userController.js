const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRFT = process.env.ACCESS_TOKEN_SECRET;
const EmailSent = require('./emailSent');


const userResistor = async (req, res) => {
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
}

// Function to handle user login
const userLogin = async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });  
    // If user does not exist, return 404 status with error message
    if (!user) {
        return res.status(200).send({ success: false, message: "User not Exist" });
    }
    
    // Compare password with hashed password stored in the database
    if (await bcrypt.compare(password, user.password)) {
        // Generate JWT token
        const token = jwt.sign({ email: user.email, _id: user._id }, JWT_SECRFT, { expiresIn: 10000, })

        // If token is generated successfully, return 200 status with token, isAdmin flag, and username
        if (token) {
            return res.status(200).send({ success: true, data: token, isAdmin: user.isAdmin, uname: user.uname });
        } else {
        // If error occurred while generating token, return 500 status with error message
            return res.status(500).send({ success: false, message: "Error while login" });
        }
    }
    // If password is incorrect, return 401 status with error message
    return res.status(201).json({ success: false, message: "Invalid Password" });
}


// const getUserData = async (req, res) => {
//     const authorizationHeader = req.headers["authorization"];
//     const token = authorizationHeader.split(" ")[1];
//     try {
//         const user = jwt.verify(token, JWT_SECRFT, (err, res) => {
//             console.log(user,"uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")

//             if (err) {
//                 return "token Expired";
//             }
//             return res;
//         });
//         if (user == "token Expired") {
//             return res.send({ status: "error", data: "Token Expired" });
//         }        
//         const useremail = user.email;
//         User.findOne({ email: useremail })
//             .then((data) => {
//                 res.send({ status: "ok", data: data });
//             }).catch((error) => {
//                 res.send({ status: "error", data: error });
//             })
//     } catch (e) {
//         res.send({ status: e })
//     }
// }

const getAllUser = async (req, res) => {
    try {
        let users = await User.find({})
        if (!users) {
            return res.send({ success: false, message: "No any user" });
        }
        else {
            return res.send({ success: true, data: users })
        }
    } catch (error) {
        return res.send({ success: false, message: "No any user" });
    }
}

const deleteUser = async (req, res) => {
    const _id = req.params.id;
    try {        
        await User.deleteOne({ _id: _id });
        return res.send({ status: true, message: "Item deleted" });
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    const _id = req.body._id;
    const update = { uname: req.body.uname, email: req.body.email, gender: req.body.gender }
    try {
        await User.findOneAndUpdate({ _id: _id }, update);
        return res.send({ status: true, message: "data update successfully" });
    } catch (error) {
        console.log(error);
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;    
    try {
        const oldUser = await User.findOne({ email });        
        if (!oldUser) {
            return res.send("User Not Exists!!")
        } else {            
            EmailSent(oldUser._id);           
            return res.send({ success: true, message: 'Password reset email has been sent,please check your mail' })
        }
    } catch (error) {
        res.send({ success: false, message: 'error' });
    }
}

const resetPassword = async (req, res) => {
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
}
module.exports = {
    userResistor,
    userLogin,
    // getUserData,
    getAllUser,
    deleteUser,
    updateUser,
    forgetPassword,
    resetPassword
}
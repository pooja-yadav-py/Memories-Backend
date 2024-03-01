const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRFT = process.env.ACCESS_TOKEN_SECRET;
const EmailSent = require('./emailSent');


const userResistor = async (req, res) => {
    const { username, email, password, gender } = req.body

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user already exists, return 409 Conflict status
            return res.status(409).send({ success: false, message: "User Already Exists" });
        }

        // Create a new user
        await User.create({
            uname: username,
            email,
            password: hashedPassword,
            gender,
        })
        // Send success response with 200 OK status
        res.status(200).send({ success: true, message: "You are registered successfully" });
    } catch (error) {
        // If an error occurs during registration, return 500 Internal Server Error status
        res.status(500).send({ success: false, message: "Some issue occurred, please try again" });
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

const getAllUser = async (req, res) => {
    try {
        const loginUser = req.query.loginuser==='true';
        console.log("-ppp",typeof(loginUser));
        let token = req.token;
        const decode = jwt.decode(token);
        const userId = decode._id;
        console.log("=========",userId);
        let userData;
        if(loginUser){
             userData = await User.findOne({_id:userId});
        }else{
             userData = await User.find({})
        }
        console.log("==========================",userData);
        if (!userData) {
            return res.send({ success: false, message: "No any user" });
        }
        else {
            return res.send({ success: true, data: userData })
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

// const updateUser = async (req, res) => {
//     const _id = req.body._id;
//     const update = { uname: req.body.uname, email: req.body.email, gender: req.body.gender }
//     try {
//         await User.findOneAndUpdate({ _id: _id }, update);
//         return res.send({ status: true, message: "data update successfully" });
//     } catch (error) {
//         console.log(error);
//     }
// }
const updateUser = async (req, res) => {
    const { _id, ...update } = req.body;
console.log(req.body)
    try {
        // Fetch the user from the database using the _id
        const user = await User.findById(_id);

        if (req.body.oldPassword && req.body.newPassword) {
            // This is the case where the user wants to update the password
            // Check if the old password matches
            const isPasswordCorrect = await bcrypt.compare(req.body.oldPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(200).send({ status: false, message: "Old password is incorrect" });
            }

            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);

            // Update user details including the new hashed password
            await User.findByIdAndUpdate(_id, { ...update, password: hashedNewPassword });
        } else {
            // This is the case where the user updates other details excluding the password
            // Update user details excluding the password
            await User.findByIdAndUpdate(_id, update);
        }

        return res.status(200).send({ status: true, message: "Data updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: "Internal server error" });
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.send("User Not Exists!!")
        } else {
            EmailSent(existingUser._id);
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
        const hashedPassword = await bcrypt.hash(password, 10)
        let updateuser = await User.updateOne({ _id: id }, { password: hashedPassword });
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
    getAllUser,
    deleteUser,
    updateUser,
    forgetPassword,
    resetPassword
}
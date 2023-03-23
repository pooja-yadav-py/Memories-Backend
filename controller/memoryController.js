const jwt = require("jsonwebtoken");
const path = require('path');
const multer = require("multer");

const Memory = require('../models/memoryModel');
const JWT_SECRFT = process.env.ACCESS_TOKEN_SECRET;

//storage
const Storage = multer.diskStorage({
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        // cb(null, file.originalname);
    }
})
const upload = multer({
    storage: Storage
}).single("selectedFile")


const createMemory = async (req, res) => {
    let token = req.token
    // const filename = req.params.filename;
    const decode = jwt.decode(token)
    try {
        upload(req, res, async (err) => {
            const { title, message, name } = req.body;
            console.log(req.file.filename)
            if (err) {
                console.log(err);
            }
            else {
                const newImage = new Memory({
                    creator: decode._id,
                    title: title,
                    message: message,
                    selectedFile: req.file.filename,
                    name: name
                })
                await newImage.save()
            }
        })
        res.send({ success: true, message: "your memory created successfully" })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: "some issue please try again" })
    }
}

const getUserMemory = async (req, res) => {
    let token = req.token;
    const decode = jwt.decode(token)
    try {
        let memoriesResonse = await Memory.find({ "creator": decode._id }).populate('creator').exec();
        if (!memoriesResonse) {
            return res.send({ success: false, message: "No any memory" });
        }
        else {
            memoriesResonse = memoriesResonse.map(memory => {
                memory.selectedFile = req.protocol + '://' + req.get('host') + '/images/' + memory.selectedFile;
                return memory
            })
            return res.send({ success: true, data: memoriesResonse, message: "your memory created successfully" })
        }
    } catch (error) {
        console.log(error);
    }
}

const getAllMemory = async (req, res) => {
    const filename = req.params.filename;
    try {
        let memoriesResonse = await Memory.find({})
        console.log(memoriesResonse);
        if (!memoriesResonse) {
            return res.send({ success: false, message: "No any memory" });
        }
        else {
            memoriesResonse = memoriesResonse.map(memory => {
                memory.selectedFile = req.protocol + '://' + req.get('host') + '/images/' + memory.selectedFile;
                return memory
            })
            return res.send({ success: true, data: memoriesResonse })
        }
    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: "No any memory" });
    }
}

const deleteMemory = async (req, res) => {
    const isAdmin = req.headers.isadmin;   
    let token = req.token;
    const decode = jwt.decode(token)    
    const _id = req.params.id;    
    try {
        let memoryCreator = await Memory.findOne({_id:_id});           
        if(memoryCreator.creator==decode._id || isAdmin){           
            await Memory.deleteOne({ _id: _id });
            return res.send({ status: true, message: "Memory deleted" });
        }else{
            return res.send({ status: false, message: "User not valid" });
        }       
    } catch (error) {
        console.log(error);
    }
}

const updateMemory = (req, res) => {
    let token = req.token;
    const decode = jwt.decode(token)
    try {
        upload(req, res, async (err) => {            
            const { title, message, selectedFile } = req.body;
            if (selectedFile) {
                update = { title, message, selectedFile }
            } else {
                update = { title, message }
            }
            const _id = req.body._id;
            if (err) {
                console.log(err);
            }
            else {
                let memoryCreator = await Memory.findOne({_id:_id});           
                 if(memoryCreator.creator==decode._id){  
                    await Memory.updateOne({ _id: _id }, update);
                    return res.send({ status: true, message: "data update successfully" });
                 } else{
                    return res.send({ status: false, message: "User not valid" });
                 }
               
            }
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createMemory,
    getUserMemory,
    getAllMemory,
    deleteMemory,
    updateMemory
}
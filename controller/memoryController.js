const jwt = require("jsonwebtoken");
const path = require('path');
const multer = require("multer");

const Memory = require('../models/memoryModel');
const MemoryLikes = require('../models/likesModel');
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
            const { title, message, name, tags } = req.body;
            if (err) {
                console.log(err);
            }
            else {
                const newImage = new Memory({
                    creator: decode._id,
                    title: title,
                    message: message,
                    selectedFile: req.file.filename,
                    name: name,
                    tags: tags
                })
                let newMemory = await newImage.save()
                res.send({ success: true, message: "your memory created successfully",data:newMemory})

            }
        })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: "some issue please try again" })
    }
}

const getUserMemory = async (req, res) => {
    let token = req.token;
    const decode = jwt.decode(token)
    try {
        let memoriesResonse = await Memory.find({ "creator": decode._id }).sort({ createdAt: -1 }).populate('creator').exec();
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
        let memoriesResonse = await Memory.find({}).sort({ createdAt: -1 })
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
        let memoryCreator = await Memory.findOne({ _id: _id });
        if (memoryCreator.creator == decode._id || isAdmin) {
            await Memory.deleteOne({ _id: _id });
            return res.send({ status: true, message: "Memory deleted" });
        } else {
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
                let memoryCreator = await Memory.findOne({ _id: _id });
                if (memoryCreator.creator == decode._id) {
                    await Memory.updateOne({ _id: _id }, update);
                    return res.send({ status: true, message: "data update successfully" });
                } else {
                    return res.send({ status: false, message: "User not valid" });
                }
            }
        })
    } catch (err) {
        console.log(err);
    }
}

const likeMemory = async (req, res) => {
    let token = req.token;
    const decode = jwt.decode(token);
    const userId = decode._id;
    const memoryId = req.body.memory_id;
    try {
        let undoLike = await MemoryLikes.find({ userId: userId, memoryId: memoryId })
        console.log("add",memoryId)
        // console.log("unlike",undoLike[0].memoryId);
        if (undoLike.length > 0) {
            // Delete the document
            const deleteResult = await MemoryLikes.deleteOne(undoLike[0]._id);
            console.log("deleteResult",deleteResult)
            res.send({ success: true, message: "Memory DisLike",data:memoryId })
             
        } else {
            await MemoryLikes.create({
                userId: decode._id,
                memoryId: req.body.memory_id
            })
            res.send({ success: true, message: "Memory Like",data:memoryId })
        }

    } catch (err) {
        console.log(err);
        res.send({ success: false, message: "some issue please try again" })
    }
}

const userLikeMemory = async (req, res) => {
    let token = req.token;
    const decode = jwt.decode(token)
    const userId = decode._id;
    try {
        let memoryLikeUser = await MemoryLikes.find({ userId });
        res.send({ success: true, data: memoryLikeUser })
    } catch (error) {
        res.send({ success: false, data: "some issue please try again" })
        console.log(error);
    }
}

const likeCount = async(req,res)=>{
    
}

module.exports = {
    createMemory,
    getUserMemory,
    getAllMemory,
    deleteMemory,
    updateMemory,
    likeMemory,
    userLikeMemory
}
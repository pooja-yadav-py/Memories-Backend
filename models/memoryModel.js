const mongoose = require('mongoose');
const Like = require('./likesModel');


const MemoryDetailsSchema = new mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Userinfo',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        selectedFile: String,
        name: String,
        tags: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },{
    collection: "Memoryinfo",
}
);

const Memory = mongoose.model("Memoryinfo", MemoryDetailsSchema);
module.exports = Memory;
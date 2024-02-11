const mongoose = require('mongoose');
const likeMemory = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userinfo', required: true },
        createdAt: { type: Date, default: Date.now },
        memoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Memoryinfo', required: true },

    },{
        collection: "Likeinfo",
    }
)

const Like = mongoose.model("Likeinfo",likeMemory)

module.exports = Like;
const mongoose= require('mongoose');
const User = require('./userModel');


const MemoryDetailsSchema = new mongoose.Schema(
    {
        creator:{
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
        title:String,
        message:String,                
        selectedFile:String,
        name:String,
        
        // {
        //     data:Buffer,
        //     contentType:String
        // },
        // likeCount:{
        //     type:Number,
        //     default:0
        // },
              
    },{
        collection:"Memoryinfo",
    }
);

const Memory = mongoose.model("Memoryinfo",MemoryDetailsSchema);
module.exports = Memory;
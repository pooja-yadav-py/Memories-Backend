const mongoose= require('mongoose');


const MemoryDetailsSchema = new mongoose.Schema(
    {
        creator:String,
        title:String,
        message:String,                
        selectedFile:String,
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
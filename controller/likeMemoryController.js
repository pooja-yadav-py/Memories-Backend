const { ObjectId } = require('mongodb');
const Memory = require('../models/memoryModel');

const jwt = require("jsonwebtoken");
const LikeMemory = async (req,res)=>{
    console.log("111111111=================@@@@@@@@@@@@@@@");
    let token = req.token;
    const decode = jwt.decode(token)
    try{
        await MemoryLikes.create({
            userId: decode._id,
            memoryId: req.body.memoryId
        })
        
        res.send({ success: true, message: "Memory Like" })
        
    }catch(error){
        console.log("==",error)
    }
}


const getTotalLikesForMemory = async(req,res) =>{
    // let token = req.token;
    // const decode = jwt.decode(token)
    try{
        // Aggregate pipeline to join memory and memoryLike collections
        const pipeline= [
            {
                $lookup: {
                    from: 'Likeinfo',
                    localField: '_id',
                    foreignField: 'memoryId',
                    as: 'likes'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    totalLikes: { $sum: { $size: '$likes' } } 
                }
            }
        ]
        const result = await Memory.aggregate(pipeline);
        console.log("=============",result);
        res.send({ success: true, message: "Memory Like", data:result })
        
    }catch(error){
        console.log(error);
    }

}


module.exports = {LikeMemory,getTotalLikesForMemory};
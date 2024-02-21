const Memory = require("../models/memoryModel");
const Like = require("../models/likesModel");
const jwt = require("jsonwebtoken");
const { find } = require("../models/userModel");

const getTotalLikesForMemory = async (req, res) => {
  try {
    // Aggregate pipeline to join memory and memoryLike collections
    const pipeline = [
      {
        $lookup: {
          from: "Likeinfo",
          localField: "_id",
          foreignField: "memoryId",
          as: "likes",
        },
      },
      {
        $group: {
          _id: "$_id",
          totalLikes: { $sum: { $size: "$likes" } },
        },
      },
    ];
    const result = await Memory.aggregate(pipeline);
    console.log("=============", result);
    res.send({ success: true, message: "Memory Like", data: result });
  } catch (error) {
    console.log(error);
  }
};

const memoryLikeUser = async (req, res) => {
  const id = req.body.memory_id;
  console.log("=====", id);
  try {
    const response = await Like.find({ memoryId: id })
      .populate("userId")
      .exec();
    console.log("==ressss", response);
    res.send({ success: true, message: "Ok", data: response });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getTotalLikesForMemory, memoryLikeUser };

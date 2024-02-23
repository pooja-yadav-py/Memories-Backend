const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");

const Memory = require("../models/memoryModel");
const MemoryLikes = require("../models/likesModel");

//storage
const Storage = multer.diskStorage({
  destination: "images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: Storage,
}).single("selectedFile");

// Create a new memory
const createMemory = async (req, res) => {
  // Extract token and decode it to get user information
  let token = req.token;
  const decode = jwt.decode(token);
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      // Extract memory data from request body
      const { title, message, name, tags } = req.body;
      // Check for file upload error
      if (err) {
        console.log(err);
        // If there's an error uploading file, return 400 status with error message
        return res
          .status(400)
          .send({ success: false, message: "Error uploading file" });
      } else {
        // Create a new memory object
        const newImage = new Memory({
          creator: decode._id,
          title: title,
          message: message,
          selectedFile: req.file.filename,
          name: name,
          tags: tags,
        });
        // Save the new memory to the database
        let newMemory = await newImage.save();
        // Return 201 status with success message and new memory data
        return res.status(201).send({
          success: true,
          message: "Your memory created successfully",
          data: newMemory,
        });
      }
    });
  } catch (error) {
    console.log(error);
    // If there's a server error, return 500 status with error message
    return res
      .status(500)
      .send({ success: false, message: "Some issue, please try again" });
  }
};

// Function to get memories of the logged-in user
// const getUserMemory = async (req, res) => {
//   // Extract token and decode it to get user information
//   let token = req.token;
//   const decode = jwt.decode(token);
//   const searchQueryValue = req.query;
//   const { name, tag, title, description, isMyMemory } = searchQueryValue;
//   try {
//     let filteredMemories = [];
//     // Handle multiple parameters by constructing a complex query
//     const query = [];
//     if (name?.length) {
//       query.push({ name: { $regex: name, $options: "i" } });
//     }
//     if (tag?.length) {
//       query.push({ tags: { $regex: tag, $options: "i" } });
//     }
//     if (title?.length) {
//       query.push({ title: { $regex: title, $options: "i" } });
//     }
//     if (description?.length) {
//       query.push({ message: { $regex: description, $options: "i" } });
//     }
//     if (query.length) {
//       filteredMemories = await Memory.find({ creator: decode._id, $and: query })
//         .sort({ createdAt: -1 })
//         .populate("creator")
//         .exec();
//       if (filteredMemories.length === 0) {
//         return res
//           .status(200)
//           .send({ success: false, message: "No matching data found" });
//       }
//       // Modify memory objects to include full image URLs
//       filteredMemories = filteredMemories.map((memory) => {
//         memory.selectedFile =
//           req.protocol +
//           "://" +
//           req.get("host") +
//           "/images/" +
//           memory.selectedFile;
//         return memory;
//       });
//       return res
//         .status(200)
//         .send({ success: true, message: "Data found", data: filteredMemories });
//     } else {
//       // Find memories created by the user and sort by createdAt in descending order
//       let memoriesResponse = await Memory.find({ creator: decode._id })
//         .sort({ createdAt: -1 })
//         .populate("creator")
//         .exec();

//       // If no memories found, return 404 status with error message
//       if (!memoriesResponse || memoriesResponse.length === 0) {
//         return res
//           .status(404)
//           .send({ success: false, message: "No memories found" });
//       } else {
//         // Modify memory objects to include full image URLs
//         memoriesResponse = memoriesResponse.map((memory) => {
//           memory.selectedFile =
//             req.protocol +
//             "://" +
//             req.get("host") +
//             "/images/" +
//             memory.selectedFile;
//           return memory;
//         });
//         // Return 200 status with memories data and success message
//         return res
//           .status(200)
//           .send({
//             success: true,
//             data: memoriesResponse,
//             message: "Your memories retrieved successfully",
//           });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     // If any error occurs, return 500 status
//     return res
//       .status(500)
//       .send({ success: false, message: "Internal server error" });
//   }
// };

// Function to get all memories
const getAllMemory = async (req, res) => {
  let token = req.token;
  const decode = jwt.decode(token);
  // Access query parameters from req.query object
  const searchQueryValue = req.query;
  const { name, tag, title, description, isMyMemory } = searchQueryValue;
  console.log(isMyMemory, "ismymemory");
  try {
    let filteredMemories = [];
    // Handle multiple parameters by constructing a complex query
    const query = [];

    if (name?.length) {
      query.push({ name: { $regex: name, $options: "i" } });
    }
    if (tag?.length) {
      query.push({ tags: { $regex: tag, $options: "i" } });
    }
    if (title?.length) {
      query.push({ title: { $regex: title, $options: "i" } });
    }
    if (description?.length) {
      query.push({ message: { $regex: description, $options: "i" } });
    }
    if (isMyMemory) {
      filteredMemories = await Memory.find(
        query.length
          ? { creator: decode._id, $and: query }
          : { creator: decode._id }
      )
        .sort({ createdAt: -1 })
        .populate("creator")
        .exec();
    } else {
      filteredMemories = await Memory.find(
        query.length ? { $and: query } : {}
      ).sort({
        createdAt: -1,
      });
    }
    if (filteredMemories.length === 0) {
      return res
        .status(200)
        .send({ success: false, message: "No matching data found" });
    }
    // Modify memory objects to include full image URLs
    filteredMemories = filteredMemories.map((memory) => {
      memory.selectedFile =
        req.protocol +
        "://" +
        req.get("host") +
        "/images/" +
        memory.selectedFile;
      return memory;
    });
    return res
      .status(200)
      .send({ success: true, message: "Data found", data: filteredMemories });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

// Function to delete a memory
const deleteMemory = async (req, res) => {
  // Extract isAdmin header and token from request
  const isAdmin = req.headers.isadmin;
  let token = req.token;
  const decode = jwt.decode(token);
  const _id = req.params.id;
  try {
    // Find the memory to delete
    let memoryCreator = await Memory.findOne({ _id: _id });

    // Check if the user is the creator of the memory or an admin
    if (memoryCreator.creator == decode._id || isAdmin) {
      // Delete the memory and return 200 status with success message
      await Memory.deleteOne({ _id: _id });
      return res.status(200).send({ status: true, message: "Memory deleted" });
    } else {
      // If user is not authorized, return 403 status with error message
      return res.status(403).send({ status: false, message: "User not valid" });
    }
  } catch (error) {
    console.log(error);
    // If any error occurs, return 500 status with error message
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

//Update memory
const updateMemory = (req, res) => {
  // Extract token and decode it to get user information
  let token = req.token;
  const decode = jwt.decode(token);
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      const { title, message, selectedFile } = req.body;
      // Determine update object based on whether a new file is uploaded or not
      let update;
      if (selectedFile) {
        update = { title, message, selectedFile };
      } else {
        update = { title, message };
      }
      const _id = req.body._id;
      if (err) {
        // If there's an error uploading file, return 400 status with error message
        console.log(err);
        return res
          .status(400)
          .send({ status: false, message: "Error uploading file" });
      } else {
        // Find the memory to update
        let memoryCreator = await Memory.findOne({ _id: _id });
        if (!memoryCreator) {
          // If memory is not found, return 404 status with error message
          return res
            .status(404)
            .send({ status: false, message: "Memory not found" });
        }
        // Check if the user is authorized to update the memory

        if (memoryCreator.creator == decode._id) {
          // Update memory and return 200 status with success message
          await Memory.updateOne({ _id: _id }, update);
          return res
            .status(200)
            .send({ status: true, message: "Data updated successfully" });
        } else {
          // If user is not authorized, return 403 status with error message
          return res
            .status(403)
            .send({ status: false, message: "User not valid" });
        }
      }
    });
  } catch (err) {
    console.log(err);
    // If there's a server error, return 500 status with error message
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

const likeMemory = async (req, res) => {
  let token = req.token;
  const decode = jwt.decode(token);
  const userId = decode._id;
  const memoryId = req.body.memory_id;
  try {
    let undoLike = await MemoryLikes.find({
      userId: userId,
      memoryId: memoryId,
    });
    console.log("add", memoryId);
    if (undoLike.length > 0) {
      // Delete the document
      const deleteResult = await MemoryLikes.deleteOne(undoLike[0]._id);
      console.log("deleteResult", deleteResult);
      res.send({ success: true, message: "Memory DisLike", data: memoryId });
    } else {
      const response = await MemoryLikes.create({
        userId: decode._id,
        memoryId: req.body.memory_id,
      });
      console.log("==response", response);
      res.send({ success: true, message: "Memory Like", data: response });
    }
  } catch (err) {
    console.log(err);
    res.send({ success: false, message: "some issue please try again" });
  }
};

const userLikeMemory = async (req, res) => {
  let token = req.token;
  const decode = jwt.decode(token);
  const userId = decode._id;
  try {
    let memoryLikeUser = await MemoryLikes.find({ userId });
    res.send({ success: true, data: memoryLikeUser });
  } catch (error) {
    res.send({ success: false, data: "some issue please try again" });
    console.log(error);
  }
};

const memoriesHistory = async (req, res) => {
  try {
    const result = await Memory.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);
    
    console.log(result); 
    res.status(200).send({ success: true, message: "ok",data: result });
    
  } catch (e) {
    console.error(e);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  createMemory,
  // getUserMemory,
  getAllMemory,
  deleteMemory,
  updateMemory,
  likeMemory,
  userLikeMemory,
  memoriesHistory,
};

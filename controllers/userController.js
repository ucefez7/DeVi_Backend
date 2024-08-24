const User = require('../models/User');
const UserPost = require('../models/userPost');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Get all users by ID
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log("user are here"+users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("users",user);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    console.log(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_posts', // The folder name in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });


// Create a new post
exports.createPost = [
  upload.single('image'),
  async (req, res) => {
    try {
      console.log("Post create chyyan povaann");

      const newPost = new UserPost({
        userId: req.body.userId, 
        content: req.body.content,
        image: req.file ? req.file.path : null // Store the Cloudinary URL to the image
      });

      await newPost.save();
      res.status(201).json(newPost);
      console.log("Create aayind post");

    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];





// Get all posts by a user
// exports.getPostsByUserId = async (req, res) => {
//   try {
//     const posts = await UserPost.find({ userId: req.params.userId });
//     if (!posts) return res.status(404).json({ message: 'No posts found for this user' });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// Get all posts by a user with all details
exports.getPostsByUserId = async (req, res) => {
  try {
    const posts = await UserPost.find({ userId: req.params.userId })
      .populate({
        path: 'userId',
        select: 'isCreator isVerified username name mailAddress following followers',
        populate: [
          { path: 'following', select: '_id' },
          { path: 'followers', select: '_id' }
        ]
      });

    if (!posts.length) return res.status(404).json({ message: 'No posts found for this user' });

    const postsWithUserDetails = posts.map(post => {
      const user = post.userId;
      return {
        ...post.toObject(),
        userId: {
          ...user.toObject(),
          followingCount: user.following.length,
          followersCount: user.followers.length,
        }
      };
    });

    res.json(postsWithUserDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get all posts on the platform with user details
exports.getAllPosts = async (req, res) => {
  console.log("working anno");
  
  try {
    const posts = await UserPost.find({})
      .populate({
        path: 'userId',
        select: 'isCreator isVerified username name mailAddress following followers',
        populate: [
          { path: 'following', select: '_id' },
          { path: 'followers', select: '_id' }
        ]
      });

    if (!posts.length) return res.status(404).json({ message: 'No posts found' });

    const postsWithUserDetails = posts.map(post => {
      const user = post.userId;
      return {
        ...post.toObject(),
        userId: {
          ...user.toObject(),
          followingCount: user.following.length,
          followersCount: user.followers.length,
        }
      };
    });

    res.json(postsWithUserDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
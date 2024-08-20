const mongoose = require('mongoose');

const userPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  image: { type: String }, // URL of the image from Cloudinary
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
//   comments: [
//     {
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       content: String,
//       createdAt: { type: Date, default: Date.now }
//     }
//   ]
});

module.exports = mongoose.model('UserPost', userPostSchema);

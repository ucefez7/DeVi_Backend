// controllers/adminController.js
const Admin = require('../models/adminModel');
const { signToken } = require('../utils/jwtUtils');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    
    // Check if the admin exists and the password matches
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    // Generate JWT token if the user is authenticated
    const token = signToken(admin._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

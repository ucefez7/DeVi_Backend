const express = require('express');
const { sendFollowRequest, acceptFollowRequest, declineFollowRequest } = require('../controllers/userController');

const router = express.Router();

// Route to send a follow request
router.post('/follow/:id',sendFollowRequest);

// Route to accept a follow request
router.post('/accept-follow/:id',acceptFollowRequest);

// Route to decline a follow request
router.post('/decline-follow/:id',declineFollowRequest);

module.exports = router;

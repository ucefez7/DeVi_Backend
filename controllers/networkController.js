const User = require('../models/User');

// Send follow request
exports.sendFollowRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (targetUser.isCreator) {
            if (!user.following.includes(targetUser._id)) {
                user.following.push(targetUser._id);
                targetUser.followers.push(user._id);
            }
        } else {
            if (!user.following.includes(targetUser._id) && !targetUser.followRequestsReceived.includes(user._id)) {
                user.followRequestsSent.push(targetUser._id);
                targetUser.followRequestsReceived.push(user._id);
            }
        }

        await user.save();
        await targetUser.save();

        res.status(200).json({ msg: 'Follow request sent or user followed if creator' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Accept follow request
exports.acceptFollowRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const requestingUser = await User.findById(req.params.id);

        if (!requestingUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.followRequestsReceived.includes(requestingUser._id)) {
            user.followRequestsReceived.pull(requestingUser._id);
            user.followers.push(requestingUser._id);

            requestingUser.followRequestsSent.pull(user._id);
            requestingUser.following.push(user._id);
        } else {
            return res.status(400).json({ msg: 'Follow request not found' });
        }

        await user.save();
        await requestingUser.save();

        res.status(200).json({ msg: 'Follow request accepted' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Decline follow request
exports.declineFollowRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const requestingUser = await User.findById(req.params.id);

        if (!requestingUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.followRequestsReceived.includes(requestingUser._id)) {
            user.followRequestsReceived.pull(requestingUser._id);
            requestingUser.followRequestsSent.pull(user._id);
        } else {
            return res.status(400).json({ msg: 'Follow request not found' });
        }

        await user.save();
        await requestingUser.save();

        res.status(200).json({ msg: 'Follow request declined' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

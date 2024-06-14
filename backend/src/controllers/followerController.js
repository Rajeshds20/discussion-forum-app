const Follower = require('../models/followerModel');
const User = require('../models/userModel');

exports.followUser = async (req, res) => {
    const { id } = req.params;
    try {
        const follower = await Follower.findOne({ userId: id, followerId: req.user.id });
        if (follower) return res.status(400).json({ msg: 'Already following' });

        const newFollower = new Follower({ userId: id, followerId: req.user.id });
        await newFollower.save();
        res.json({ msg: 'Followed Successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.unfollowUser = async (req, res) => {
    const { id } = req.params;
    try {
        const follower = await Follower.findOne({ userId: id, followerId: req.user.id });
        if (!follower) return res.status(400).json({ msg: 'Not following' });

        await Follower.findByIdAndDelete(follower.id);
        res.json({ msg: 'Unfollowed Successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const followers = await Follower.find({ userId: req.user.id }).populate('followerId', 'name email');
        res.json(followers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const following = await Follower.find({ followerId: req.user.id }).populate('userId', 'name email');
        res.json(following);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

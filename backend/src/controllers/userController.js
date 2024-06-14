const User = require('../models/userModel');
const { userSchema, loginSchema } = require('../middleware/Zodvalidation');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.getUserByName = async (req, res) => {
    const { name } = req.query;
    try {
        const users = await User.find({ name: new RegExp(name, 'i') });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, mobile, email } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { name, mobile, email }, { new: true });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userSchema, loginSchema } = require('../middleware/Zodvalidation');

exports.signup = async (req, res) => {

    const { name, mobile, email, password } = req.body;
    try {
        userSchema.parse(req.body);

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, mobile, email, password });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.json({ msg: 'Signed up successfully' });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {

    const { email, password } = req.body;
    try {

        loginSchema.parse(req.body);

        let user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.json({ msg: 'Logged in successfully' });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ msg: 'Server error' });
    }
};

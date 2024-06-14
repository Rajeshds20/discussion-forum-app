const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // const authorization = req.headers.authorization;
    // const token = authorization && authorization.startsWith('Bearer') ? authorization.split(' ')[1] : null;

    // Get auth token from cookie

    const cookie = req.cookies;

    if (!cookie)
        return res.status(401).json({ msg: 'No token, authorization denied' });

    const token = req.cookies.token;

    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

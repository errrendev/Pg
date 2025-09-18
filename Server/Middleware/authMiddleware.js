const jwt = require('jsonwebtoken');
const adminModel = require('./../Model/auth');

module.exports.authUser = async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies && req.cookies.token;
        const token = cookieToken || (authHeader && authHeader.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ error: 'Authentication token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await adminModel.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};


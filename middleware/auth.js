const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            error: 'Authentication required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }
}

function requireRole(role) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        if (req.user.role !== role) {
            return res.status(403).json({
                error: 'Access forbidden'
            });
        }

        next();
    };
}

module.exports = {
    requireAuth,
    requireRole
};
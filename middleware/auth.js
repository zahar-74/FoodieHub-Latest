const jwt = require('jsonwebtoken');

// Must be logged in (valid JWT stored in cookies)
function protect(req, res, next) {
    const token = req.cookies?.token; //  confirm cookie name "token" with Track 3
    if (!token) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // expected: { id, role, ... } — confirm shape with Track 3
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function requireCustomer(req, res, next) {
    if (!req.user || req.user.role !== 'customer') {
        return res.status(403).json({ error: 'Customers only' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admins only' });
    }
    next();
}

module.exports = { protect, requireCustomer, requireAdmin };

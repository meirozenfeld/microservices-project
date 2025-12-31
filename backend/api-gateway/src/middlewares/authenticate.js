const jwt = require("jsonwebtoken");

/**
 * Authentication middleware
 * Validates JWT and attaches user to request
 */
module.exports = function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Missing Authorization header",
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            error: "Invalid Authorization header format",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            roles: decoded.roles || [],
        };

        next();
    } catch (err) {
        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }
};

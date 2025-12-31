const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
    const userId = req.headers['x-user-id'];

    // Debug log
    logger.debug(
        {
            userId: req.headers["x-user-id"],
            hasAuth: Boolean(req.headers["authorization"]),
        },
        "Auth middleware headers"
    );

    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized: missing user context'
        });
    }

    req.user = {
        id: userId
    };

    next();
};

module.exports = authMiddleware;

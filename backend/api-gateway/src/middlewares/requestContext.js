const { randomUUID } = require("crypto");

module.exports = function requestContext(req, res, next) {
    const requestId = req.headers["x-request-id"] || randomUUID();
    const correlationId =
        req.headers["x-correlation-id"] || requestId;

    req.requestId = requestId;
    req.correlationId = correlationId;

    res.setHeader("x-request-id", requestId);
    res.setHeader("x-correlation-id", correlationId);

    next();
};

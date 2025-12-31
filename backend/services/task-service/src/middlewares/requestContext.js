const { randomUUID } = require("crypto");
const { runWithContext } = require("../context/requestContext.store");

module.exports = function requestContext(req, res, next) {
    const requestId = req.headers["x-request-id"] || randomUUID();
    const correlationId =
        req.headers["x-correlation-id"] || requestId;

    const context = {
        requestId,
        correlationId,
    };

    res.setHeader("x-request-id", requestId);
    res.setHeader("x-correlation-id", correlationId);

    runWithContext(context, () => {
        req.requestId = requestId;
        req.correlationId = correlationId;
        next();
    });
};

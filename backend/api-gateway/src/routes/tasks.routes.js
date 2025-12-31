const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const logger = require("../utils/logger");

const router = express.Router();

// TEMP dev auth (עד Phase Security)
router.use((req, res, next) => {
    req.user = { id: "user-123" };
    next();
});

// headers for task-service
router.use((req, res, next) => {
    const userId = req.user.id;

    req.headers["x-user-id"] = userId;

    if (req.requestId) {
        req.headers["x-request-id"] = req.requestId;
    }
    if (req.correlationId) {
        req.headers["x-correlation-id"] = req.correlationId;
    }

    next();
});

router.use(
    createProxyMiddleware({
        target: "http://task-service:3003",
        changeOrigin: true,
        xfwd: true,
        pathRewrite: (path) => "/tasks" + path,
        onProxyReq: (proxyReq, req) => {
            logger.info(
                {
                    method: req.method,
                    path: req.path,
                    userId: req.headers["x-user-id"],
                    requestId: req.headers["x-request-id"],
                },
                "Proxying request to task-service"
            );
        },
    })
);

module.exports = router;

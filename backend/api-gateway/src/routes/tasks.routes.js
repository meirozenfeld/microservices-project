const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const logger = require("../utils/logger");

const router = express.Router();
const TASK_SERVICE_URL =
    process.env.TASK_SERVICE_URL || "http://task-service:3003";

// Temporary dev auth middleware – replace with real auth in a later security phase
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
        target: TASK_SERVICE_URL,
        changeOrigin: true,
        xfwd: true,
        pathRewrite: (path) => "/tasks" + path,
        onProxyReq: (proxyReq, req) => {
            logger.info(
                {
                    method: req.method,
                    path: req.path,
                    target: TASK_SERVICE_URL,
                },
                "Proxying request to task-service"
            );
        },
    })
);

module.exports = router;

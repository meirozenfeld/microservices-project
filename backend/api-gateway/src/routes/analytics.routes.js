const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

const ANALYTICS_SERVICE_URL =
    process.env.ANALYTICS_SERVICE_URL || "http://analytics-service:3006";

router.use(
    createProxyMiddleware({
        target: ANALYTICS_SERVICE_URL,
        changeOrigin: true,
        xfwd: true,
        onProxyReq: (proxyReq, req) => {
            if (req.headers.authorization) {
                proxyReq.setHeader("authorization", req.headers.authorization);
            }
            if (req.requestId) {
                proxyReq.setHeader("x-request-id", req.requestId);
            }
            if (req.correlationId) {
                proxyReq.setHeader("x-correlation-id", req.correlationId);
            }
        },
    })
);

module.exports = router;

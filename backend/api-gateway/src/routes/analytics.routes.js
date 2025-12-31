const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

router.use(
    createProxyMiddleware({
        target: "http://analytics-service:3006",
        changeOrigin: true,
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

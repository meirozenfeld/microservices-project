const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

router.use(
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL,
        changeOrigin: true,

        onProxyReq: (proxyReq, req) => {
            if (req.headers.cookie) {
                proxyReq.setHeader("cookie", req.headers.cookie);
            }
            if (req.headers.authorization) {
                proxyReq.setHeader("authorization", req.headers.authorization);
            }
        },
    })
);

module.exports = router;

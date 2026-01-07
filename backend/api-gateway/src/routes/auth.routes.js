const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const logger = require("../utils/logger");

const router = express.Router();

router.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

router.use(
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL, // e.g. http://auth-service:3001
        changeOrigin: true,

        // avoid infinite hanging requests
        timeout: 15000,
        proxyTimeout: 15000,

        // forward cookies & auth headers
        onProxyReq(proxyReq, req) {
            logger.info({
                method: req.method,
                originalUrl: req.originalUrl,
                path: req.path,
                target: process.env.AUTH_SERVICE_URL,
                proxyPath: proxyReq.path,
            }, "[AUTH PROXY] Forwarding request");

            if (req.headers.cookie) {
                proxyReq.setHeader("cookie", req.headers.cookie);
            }
            if (req.headers.authorization) {
                proxyReq.setHeader("authorization", req.headers.authorization);
            }
        },

        onError(err, req, res) {
            logger.error({ err, method: req.method, path: req.path }, "[AUTH PROXY] Proxy error");
            res.status(502).json({
                error: "Auth service unavailable",
            });
        },
    })
);

module.exports = router;

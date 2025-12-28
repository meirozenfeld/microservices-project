require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(helmet());
app.use(cors());

// Request ID לכל בקשה
app.use((req, res, next) => {
    const rid = req.headers["x-request-id"] || crypto.randomUUID();
    req.requestId = rid;
    res.setHeader("x-request-id", rid);
    next();
});

app.use(morgan(":method :url :status - :response-time ms (rid=:req[x-request-id])"));

// Health
app.get("/health", (req, res) => {
    res.json({ ok: true, service: "api-gateway", rid: req.requestId });
});


app.use("/auth", (req, res, next) => {
    console.log("[GATEWAY] /auth hit:", req.method, req.originalUrl);
    next();
});

// Routes
app.use(
    "/auth",
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL,
        changeOrigin: true,
        onProxyReq: (proxyReq, req) => {
            if (req.headers.authorization) {
                proxyReq.setHeader("authorization", req.headers.authorization);
            }
        },
    })
);

app.use(
    "/users",
    createProxyMiddleware({
        target: process.env.USER_SERVICE_URL,
        changeOrigin: true,
        onProxyReq: (proxyReq, req) => {
            if (req.headers.authorization) {
                proxyReq.setHeader("authorization", req.headers.authorization);
            }
        },
    })
);
app.use((req, res, next) => {
    req.user = { id: 'user-123' };
    next();
});

// Middleware to set x-user-id header for task-service
app.use('/tasks', (req, res, next) => {
    const userId = req.user?.id || 'user-123';
    req.headers['x-user-id'] = userId;
    if (req.requestId) {
        req.headers['x-request-id'] = req.requestId;
    }
    console.log('[GATEWAY] Setting headers for task-service:', {
        'x-user-id': userId,
        'x-request-id': req.requestId
    });
    next();
});

app.use(
    '/tasks',
    createProxyMiddleware({
        target: 'http://task-service:3003',
        changeOrigin: true,
        xfwd: true,
        pathRewrite: function (path, req) {
            // http-proxy-middleware removes /tasks prefix, so path is "/" or "/something"
            // We need to add /tasks back since task-service expects it
            return '/tasks' + path;
        },
        onProxyReq: (proxyReq, req, res) => {
            // Headers should already be set by middleware above
            // Just log to verify
            console.log('[GATEWAY] Proxying to task-service:', {
                method: req.method,
                path: req.path,
                'x-user-id': req.headers['x-user-id'],
                'x-request-id': req.headers['x-request-id']
            });
        }
    })
);




// 404
app.use((req, res) => {
    res.status(404).json({ ok: false, error: "Not found" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`[api-gateway] listening on ${port}`);
    console.log(`[api-gateway] AUTH -> ${process.env.AUTH_SERVICE_URL}`);
    console.log(`[api-gateway] USER -> ${process.env.USER_SERVICE_URL}`);
});

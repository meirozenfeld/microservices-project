const express = require('express');
const taskRoutes = require('./routes/task.routes');
const requestContext = require("./middlewares/requestContext");
const httpLogger = require("./middlewares/httpLogger");
const logger = require("./utils/logger");
const { isMongoReady } = require("./health/readiness");
const {
    recordRequest,
    recordError,
} = require("./metrics/metrics");
const { snapshot } = require("./metrics/metrics");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        recordRequest(duration);

        if (res.statusCode >= 500) {
            recordError();
        }
    });

    next();
});

app.use(requestContext);
app.use(httpLogger);

// 🔴 LOG CRITICAL
app.use((req, res, next) => {
    logger.info(
        {
            method: req.method,
            url: req.url,
            body: req.body,
            requestId: req.requestId,
        },
        "Incoming request"
    );
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'task-service',
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.get("/health/live", (req, res) => {
    res.status(200).json({
        status: "alive",
        service: "task-service",
    });
});

app.get("/health/ready", (req, res) => {
    if (!isMongoReady()) {
        return res.status(503).json({
            status: "not-ready",
            dependency: "mongo",
        });
    }

    res.status(200).json({
        status: "ready",
        service: "task-service",
    });
});

app.get("/metrics", (req, res) => {
    res.json(snapshot());
});

// Task routes
app.use('/tasks', taskRoutes);

module.exports = app;

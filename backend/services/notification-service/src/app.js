const express = require("express");
const startTaskEventsConsumer = require("./consumers/taskEvents.consumer");
const logger = require("./utils/logger");
const { isReady } = require("./health/readiness");
const { snapshot } = require("./metrics/metrics");

const app = express();

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        service: "notification-service",
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

app.get("/health/live", (req, res) => {
    res.status(200).json({
        status: "alive",
        service: "notification-service",
    });
});

app.get("/health/ready", (req, res) => {
    if (!isReady()) {
        return res.status(503).json({ status: "not-ready" });
    }

    res.status(200).json({
        status: "ready",
        service: "notification-service",
    });
});

app.get("/metrics", (req, res) => {
    res.json(snapshot());
});


// ⬅️ Kafka consumer startup
const isProd = process.env.NODE_ENV === "production";
const kafkaEnabled = process.env.KAFKA_ENABLED === "true";

// ⬅️ Kafka consumer startup (רק אם מותר)
if (kafkaEnabled && !isProd) {
    startTaskEventsConsumer().catch(err => {
        logger.fatal(
            { err },
            "Failed to start Kafka consumer"
        );
    });
}


module.exports = app;

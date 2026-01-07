const express = require("express");
const redis = require("../config/redis");

const router = express.Router();

router.get("/health", async (req, res) => {
    try {
        if (!redis) {
            return res.json({
                service: "analytics-service",
                status: "ok",
                redis: "disabled",
                timestamp: new Date().toISOString()
            });
        }

        const ping = await redis.ping();
        res.json({
            service: "analytics-service",
            status: "ok",
            redis: ping,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({
            service: "analytics-service",
            status: "error",
            error: err.message
        });
    }
});


module.exports = router;

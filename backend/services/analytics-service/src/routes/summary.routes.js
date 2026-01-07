const express = require("express");
const router = express.Router();
const redis = require("../config/redis");

// GET /summary
router.get("/summary", async (req, res) => {
    try {
        if (!redis) {
            return res.json({
                tasks: { created: 0, completed: 0 },
                daily: {},
                note: "Redis disabled"
            });
        }

        const created = Number(await redis.get("analytics:tasks:created")) || 0;
        const completed = Number(await redis.get("analytics:tasks:completed")) || 0;

        const keys = await redis.keys("analytics:daily:*:created");
        const daily = {};

        for (const key of keys) {
            const [, , date] = key.split(":");
            const value = Number(await redis.get(key)) || 0;

            daily[date] = {
                ...(daily[date] || {}),
                created: value,
            };
        }

        res.json({
            tasks: { created, completed },
            daily,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to build summary" });
    }
});

module.exports = router;

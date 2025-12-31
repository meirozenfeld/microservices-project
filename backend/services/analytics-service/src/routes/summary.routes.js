const express = require("express");
const router = express.Router();
const redis = require("../config/redis");

// GET /summary
router.get("/summary", async (req, res) => {
    try {
        const created = Number(await redis.get("analytics:tasks:created")) || 0;
        const completed = Number(await redis.get("analytics:tasks:completed")) || 0;

        // daily keys
        const keys = await redis.keys("analytics:daily:*:created");
        const daily = {};

        for (const key of keys) {
            // analytics:daily:2025-12-30:created
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
        console.error(err);
        res.status(500).json({ error: "Failed to build summary" });
    }
});

module.exports = router;

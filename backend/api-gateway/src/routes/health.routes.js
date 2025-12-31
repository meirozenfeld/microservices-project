const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        ok: true,
        service: "api-gateway",
        requestId: req.requestId,
    });
});

router.get("/health/live", (req, res) => {
    res.json({
        status: "alive",
        service: "api-gateway",
    });
});

module.exports = router;

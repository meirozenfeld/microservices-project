const pino = require("pino");

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    base: {
        service: "api-gateway",
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;

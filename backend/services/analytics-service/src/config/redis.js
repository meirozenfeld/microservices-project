const Redis = require("ioredis");

let redis = null;

if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
    });

    redis.on("connect", () => {
        console.log("[REDIS] connected");
    });

    redis.on("error", (err) => {
        console.error("[REDIS] error", err.message);
    });
} else {
    console.warn("[REDIS] disabled – missing REDIS_HOST/PORT");
}

module.exports = redis;

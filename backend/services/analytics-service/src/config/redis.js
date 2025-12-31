const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redis.on("connect", () => {
    console.log("[REDIS] connected");
});

redis.on("error", (err) => {
    console.error("[REDIS] error", err);
});

module.exports = redis;

const consumer = require("./config/kafka");
const redis = require("./config/redis");
const { log, error } = require("./utils/logger");
const { getTodayKey, getDayKeyFromDate } = require("./utils/date");

const DAILY_TTL_SECONDS = 60 * 60 * 24 * 14;
const ALLOWED_ACTIONS = ["created", "completed"];

async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({
        topic: "task.events",
        fromBeginning: false
    });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const event = JSON.parse(message.value.toString());
                const eventType = event.eventType;

                if (!eventType?.startsWith("task.")) return;

                const action = eventType.split(".")[1];
                if (!ALLOWED_ACTIONS.includes(action)) return;

                // Idempotency
                const eventKey = `analytics:events:${event.eventId}`;
                const isNew = await redis.setnx(eventKey, "1");
                if (!isNew) return;
                await redis.expire(eventKey, 60 * 60 * 24);

                const dayKey = event.occurredAt
                    ? getDayKeyFromDate(event.occurredAt)
                    : getTodayKey();

                await redis.incr(`analytics:tasks:${action}`);
                const dailyKey = `analytics:daily:${dayKey}:${action}`;
                await redis.incr(dailyKey);
                await redis.expire(dailyKey, DAILY_TTL_SECONDS);

                log(`Analytics updated: ${action}`);
            } catch (err) {
                error("Failed to process analytics event", err);
            }
        }
    });
}

module.exports = startConsumer;

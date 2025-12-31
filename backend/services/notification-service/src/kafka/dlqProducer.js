const kafka = require("./kafkaClient");
const logger = require("../utils/logger");

const producer = kafka.producer();
let connected = false;

async function sendToDLQ(originalEvent, reason) {
    if (!connected) {
        await producer.connect();
        connected = true;
    }

    const dlqEvent = {
        ...originalEvent,
        dlqReason: reason,
        failedAt: new Date().toISOString(),
    };

    await producer.send({
        topic: "task.events.dlq",
        messages: [
            {
                key: originalEvent.eventId,
                value: JSON.stringify(dlqEvent),
            },
        ],
    });

    logger.error(
        {
            eventId: originalEvent.eventId,
            correlationId: originalEvent.correlationId,
            reason,
        },
        "Event sent to DLQ"
    );
}

module.exports = { sendToDLQ };

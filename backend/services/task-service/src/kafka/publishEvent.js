const { producer, connectProducer } = require("./kafkaClient");
const { randomUUID } = require("crypto");
const { getContext } = require("../context/requestContext.store");
const logger = require("../utils/logger");

async function publishEvent({
    topic,
    eventType,
    payload,
    correlationId: explicitCorrelationId,
}) {
    await connectProducer();

    const context = getContext();
    const correlationId =
        explicitCorrelationId ||
        context?.correlationId ||
        randomUUID();

    const event = {
        eventId: randomUUID(),
        eventType,
        occurredAt: new Date().toISOString(),
        producer: "task-service",
        correlationId,
        payload,
    };

    await producer.send({
        topic,
        messages: [
            {
                key: event.eventId,
                value: JSON.stringify(event),
            },
        ],
    });

    logger.info(
        { eventType, correlationId },
        "Event published to Kafka"
    );
}

module.exports = publishEvent;

const { producer, connectProducer } = require("./kafkaClient");
const { randomUUID } = require("crypto");

async function publishEvent({
    topic,
    eventType,
    payload,
    correlationId,
}) {
    await connectProducer();

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

    console.log(`📨 Event published: ${eventType}`);
}

module.exports = publishEvent;

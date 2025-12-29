const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "task-service-audit-consumer",
    brokers: process.env.KAFKA_BROKERS.split(","),
});

const consumer = kafka.consumer({
    groupId: "task-audit-group",
});

async function startAuditConsumer() {
    await consumer.connect();
    await consumer.subscribe({
        topic: "task.events",
        fromBeginning: true,
    });

    console.log("👂 Audit consumer listening to task.events");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const value = message.value.toString();
                const event = JSON.parse(value);

                console.log("📥 [AUDIT EVENT]", {
                    topic,
                    partition,
                    eventType: event.eventType,
                    correlationId: event.correlationId,
                    payload: event.payload,
                });

            } catch (err) {
                console.error("❌ Failed to process audit event", {
                    error: err.message,
                    rawMessage: message.value?.toString(),
                });
            }
        },
    });

}

module.exports = startAuditConsumer;

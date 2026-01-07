const logger = require("../utils/logger");
const { kafka } = require("./kafkaClient");


const consumer = kafka.consumer({
    groupId: "task-audit-group",
});

async function startAuditConsumer() {
    await consumer.connect();
    await consumer.subscribe({
        topic: "task.events",
        fromBeginning: true,
    });

    logger.info("Audit consumer listening to task.events");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const value = message.value.toString();
                const event = JSON.parse(value);

                logger.info(
                    {
                        eventType: event.eventType,
                        correlationId: event.correlationId,
                    },
                    "Audit event received"
                );


            } catch (err) {
                logger.error(
                    {
                        err: err.message,
                        rawMessage: message.value?.toString(),
                    },
                    "Failed to process audit event"
                );

            }
        },
    });

}

module.exports = startAuditConsumer;

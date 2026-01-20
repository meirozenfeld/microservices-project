const kafka = require("../kafka/kafkaClient");
const logger = require("../utils/logger");
const { dispatchNotification } = require("../dispatchers/notification.dispatcher");
const { sendToDLQ } = require("../kafka/dlqProducer");
const {
    isProcessed,
    markProcessed,
} = require("../store/processedEvents.store");
const { markConsumerReady } = require("../health/readiness");
const consumer = kafka.consumer({
    groupId: "notification-service-group",
});
const {
    recordProcessed,
    recordFailed,
} = require("../metrics/metrics");

const MAX_RETRIES = 3;

async function processEvent(event) {
    // Idempotency guard – if this event was already processed, skip it
    if (isProcessed(event.eventId)) {
        logger.warn(
            { eventId: event.eventId },
            "Duplicate event ignored"
        );
        return;
    }

    // Retry counter
    event.retries = event.retries ?? 0;

    try {
        await dispatchNotification(event);

        markProcessed(event.eventId);
        recordProcessed();

        logger.info(
            {
                eventId: event.eventId,
                taskId: event.payload?.taskId,
                correlationId: event.correlationId,
            },
            "Event processed successfully"
        );

    } catch (err) {
        event.retries += 1;

        logger.warn(
            {
                eventId: event.eventId,
                retries: event.retries,
                err: err.message,
                correlationId: event.correlationId,
            },
            "Event processing failed"
        );

        // Too many retries → send to DLQ and stop retrying
        if (event.retries >= MAX_RETRIES) {
            recordFailed();
            await sendToDLQ(event, err.message);
            // Do not throw here – we don't want Kafka to retry this message again
            return;
        }

        // Re-throw to let Kafka retry the message
        throw err;
    }
}

async function startTaskEventsConsumer() {
    await consumer.connect();
    await consumer.subscribe({
        topic: "task.events",
        fromBeginning: false,
    });
    markConsumerReady();
    logger.info("Listening to task.events");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let event;

            try {
                event = JSON.parse(message.value.toString());

                logger.info(
                    {
                        topic,
                        partition,
                        eventType: event.eventType,
                        correlationId: event.correlationId,
                    },
                    "Kafka event received"
                );

                if (event.eventType !== "task.created") {
                    logger.debug(
                        { eventType: event.eventType },
                        "Event ignored"
                    );
                    return;
                }

                if (!event.payload || !event.payload.taskId) {
                    logger.warn(
                        { event },
                        "task.created event without payload.taskId"
                    );
                    return;
                }

                await processEvent(event);

            } catch (err) {
                logger.error(
                    {
                        err: err.message,
                        correlationId: event?.correlationId,
                    },
                    "Kafka message processing crashed"
                );

                // Re-throw to ensure Kafka retries the message
                throw err;
            }
        },
    });
}

module.exports = startTaskEventsConsumer;

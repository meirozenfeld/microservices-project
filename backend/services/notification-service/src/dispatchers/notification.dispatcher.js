const { sendEmail } = require("../services/email.service");
const { sendWebhook } = require("../services/webhook.service");
const logger = require("../utils/logger");
const {
    isProcessed,
    markProcessed,
} = require("../store/processedEvents.store");

async function dispatchNotification(event) {
    switch (event.eventType) {
        case "task.created":
            await handleTaskCreated(event);
            break;

        default:
            logger.warn(
                { eventType: event.eventType },
                "No dispatcher handler for event"
            );
    }
}

async function handleTaskCreated(event) {
    const { taskId, title, userId } = event.payload;

    logger.info(
        {
            taskId,
            userId,
            correlationId: event.correlationId,
        },
        "Handling task.created event"
    );


    // 📧 Email
    await sendEmail({
        to: `${userId}@example.com`,
        subject: "New task created",
        body: `
Hello,

A new task was created.

Title: ${title}
Task ID: ${taskId}

— Notification Service
        `.trim()
    });

    // 🔔 Webhook
    await sendWebhook({
        url: "https://example.com/webhook",
        payload: {
            event: "task.created",
            taskId,
            title,
            userId
        }
    });
}
module.exports = {
    dispatchNotification
};

async function processEvent(event) {
    if (isProcessed(event.eventId)) {
        logger.warn(
            { eventId: event.eventId },
            "Duplicate event ignored"
        );
        return;
    }

    await dispatchNotification(event);
    markProcessed(event.eventId);
}
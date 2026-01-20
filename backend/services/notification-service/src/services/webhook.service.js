const logger = require("../utils/logger");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendWebhook({ url, payload, correlationId, retries = 3 }) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            logger.info(
                { attempt, url, correlationId, payload },
                "Webhook attempt"
            );

            if (Math.random() < 0.4) {
                throw new Error("Simulated webhook failure");
            }

            logger.info(
                { url, correlationId },
                "Webhook delivered successfully"
            );
            return;

        } catch (err) {
            logger.warn(
                { err: err.message, attempt, correlationId },
                "Webhook attempt failed"
            );

            if (attempt < retries) {
                await sleep(500);
            } else {
                logger.error(
                    { err: err.message, correlationId },
                    "All webhook retries failed"
                );

                // At this point all retry attempts have been exhausted – surface an error to the caller
                throw new Error("Webhook failed after max retries");
            }
        }
    }
}

module.exports = { sendWebhook };

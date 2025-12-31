const logger = require("../utils/logger");

async function sendEmail({ to, subject, body }) {
    logger.info(
        { to, subject },
        "Mock email sent"
    );
}

module.exports = {
    sendEmail
};

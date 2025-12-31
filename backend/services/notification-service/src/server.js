const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    logger.info({ port: PORT }, "notification-service running");
});

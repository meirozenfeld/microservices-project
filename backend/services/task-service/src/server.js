require("dotenv").config();
const app = require("./app");
const connectToMongo = require("./config/mongo");
const { port, serviceName } = require("./config/env");
const startAuditConsumer = require("./kafka/auditConsumer");
const logger = require("./utils/logger");

const isProd = process.env.NODE_ENV === "production";
const kafkaEnabled = process.env.KAFKA_ENABLED === "true";

const startServer = async () => {
    await connectToMongo();

    app.listen(port, () => {
        logger.info({ port }, `${serviceName} running`);

        // In production we run the Kafka consumer as a separate worker, not inside the web process
        if (kafkaEnabled && !isProd) {
            startAuditConsumer().catch((err) =>
                logger.error({ err }, "Audit consumer failed")
            );
        }
    });
};

startServer();

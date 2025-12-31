require('dotenv').config();
const app = require('./app');
const connectToMongo = require('./config/mongo');
const { port, serviceName } = require('./config/env');
const startAuditConsumer = require("./kafka/auditConsumer");
const logger = require("./utils/logger");

const startServer = async () => {
    await connectToMongo();

    app.listen(port, () => {
        logger.info({ port }, `${serviceName} running`);
        startAuditConsumer().catch(err =>
            logger.error({ err }, "Audit consumer failed")
        );
    });
};

startServer();
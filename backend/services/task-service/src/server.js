require('dotenv').config();
const app = require('./app');
const connectToMongo = require('./config/mongo');
const { port, serviceName } = require('./config/env');
const startAuditConsumer = require("./kafka/auditConsumer");

const startServer = async () => {
    await connectToMongo();

    app.listen(port, () => {
        console.log(`🟢 [${serviceName}] running on port ${port}`);
        startAuditConsumer().catch(console.error);
    });
};

startServer();
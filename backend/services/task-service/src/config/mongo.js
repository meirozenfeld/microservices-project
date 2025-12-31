const mongoose = require('mongoose');
const { mongoUri, mongoMaxRetries, serviceName } = require('./env');
const logger = require("../utils/logger");

let retries = 0;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoUri, {
            autoIndex: true
        });

        logger.info("MongoDB connected");
    } catch (error) {
        retries += 1;
        logger.error(
            { err: error.message, retries },
            "MongoDB connection failed"
        );

        if (retries >= mongoMaxRetries) {
            logger.error(
                { err: error.message, retries },
                "MongoDB connection failed"
            );
            process.exit(1);
        }

        setTimeout(connectToMongo, 3000);
    }
};

module.exports = connectToMongo;

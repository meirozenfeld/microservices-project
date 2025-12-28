const mongoose = require('mongoose');
const { mongoUri, mongoMaxRetries, serviceName } = require('./env');

let retries = 0;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoUri, {
            autoIndex: true
        });

        console.log(`🟢 [${serviceName}] MongoDB connected`);
    } catch (error) {
        retries += 1;
        console.error(
            `🔴 [${serviceName}] MongoDB connection failed (attempt ${retries}):`,
            error.message
        );

        if (retries >= mongoMaxRetries) {
            console.error(`❌ [${serviceName}] Max Mongo retries reached. Exiting.`);
            process.exit(1);
        }

        setTimeout(connectToMongo, 3000);
    }
};

module.exports = connectToMongo;

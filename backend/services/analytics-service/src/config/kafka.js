const { Kafka } = require("kafkajs");
const fs = require("fs");
const path = require("path");

const kafka = new Kafka({
    clientId: "analytics-service",
    brokers: process.env.KAFKA_BROKERS.split(","),

    ssl: {
        ca: [
            fs.readFileSync(
                path.join(__dirname, "../../certs/ca.pem"),
                "utf-8"
            ),
        ],
        cert: fs.readFileSync(
            path.join(__dirname, "../../certs/service.cert"),
            "utf-8"
        ),
        key: fs.readFileSync(
            path.join(__dirname, "../../certs/service.key"),
            "utf-8"
        ),
    },

    // ❌ אין sasl
});

const consumer = kafka.consumer({
    groupId: "analytics-consumer-group",
});

module.exports = consumer;

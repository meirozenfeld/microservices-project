const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "notification-service",
    brokers: ["kafka:29092"]
});

module.exports = kafka;

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "analytics-service",
    brokers: ["kafka:29092"] 
});

const consumer = kafka.consumer({
    groupId: "analytics-consumer-group"
});

module.exports = consumer;

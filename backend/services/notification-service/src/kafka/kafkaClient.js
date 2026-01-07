const { Kafka } = require("kafkajs");
const { getKafkaSslConfig } = require("../config/kafkaSsl");

const kafka = new Kafka({
    clientId: "notification-service",
    brokers: process.env.KAFKA_BROKERS.split(","),
    ssl: getKafkaSslConfig(),
});

module.exports = kafka;

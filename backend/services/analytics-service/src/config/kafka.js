const { Kafka } = require("kafkajs");
const { getKafkaSslConfig } = require("./kafkaSsl");

const kafka = new Kafka({
    clientId: "analytics-service",
    brokers: process.env.KAFKA_BROKERS.split(","),
    ssl: getKafkaSslConfig(),
});

const consumer = kafka.consumer({
    groupId: "analytics-consumer-group",
});

module.exports = consumer;

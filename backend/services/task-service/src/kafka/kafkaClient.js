const { Kafka } = require("kafkajs");
const logger = require("../utils/logger");
const { getKafkaSslConfig } = require("./kafkaSsl");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "task-service",
  brokers: process.env.KAFKA_BROKERS.split(","),
  ssl: getKafkaSslConfig(),
});

const producer = kafka.producer();
let isConnected = false;

async function connectProducer() {
  if (isConnected) return;

  await producer.connect();
  isConnected = true;
  logger.info("Kafka producer connected");
}

module.exports = {
  kafka,
  producer,
  connectProducer,
};

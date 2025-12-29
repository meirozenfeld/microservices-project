const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "task-service",
  brokers: process.env.KAFKA_BROKERS.split(","),
});

const producer = kafka.producer();

let isConnected = false;

async function connectProducer() {
  if (isConnected) return;
  await producer.connect();
  isConnected = true;
  console.log("✅ Kafka producer connected");
}

module.exports = {
  producer,
  connectProducer,
};

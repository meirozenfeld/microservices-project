const logger = require("../utils/logger");
const { Kafka } = require("kafkajs");
const fs = require("fs");
const path = require("path");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "task-service",
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
  // ❌ אין sasl - משתמשים ב-mTLS בלבד
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

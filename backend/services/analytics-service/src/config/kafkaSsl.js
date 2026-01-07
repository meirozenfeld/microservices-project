const fs = require("fs");
const path = require("path");

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function resolvePath(envVar, fallbackRelativePath) {
  if (process.env[envVar]) {
    return process.env[envVar];
  }

  return path.join(process.cwd(), fallbackRelativePath);
}

function getKafkaSslConfig() {
  const caPath = resolvePath(
    "KAFKA_CA_PATH",
    "certs/ca.pem"
  );

  const certPath = resolvePath(
    "KAFKA_CERT_PATH",
    "certs/service.cert"
  );

  const keyPath = resolvePath(
    "KAFKA_KEY_PATH",
    "certs/service.key"
  );

  return {
    ca: [readFile(caPath)],
    cert: readFile(certPath),
    key: readFile(keyPath),
  };
}

module.exports = { getKafkaSslConfig };

const requiredEnvVars = ['MONGO_URI'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
});

module.exports = {
  port: process.env.PORT || 3003,
  serviceName: process.env.SERVICE_NAME || 'task-service',
  mongoUri: process.env.MONGO_URI,
  mongoMaxRetries: Number(process.env.MONGO_MAX_RETRIES || 5)
};

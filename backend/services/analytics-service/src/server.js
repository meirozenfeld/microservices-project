require("dotenv").config();
const app = require("./app");
const startConsumer = require("./consumer");
const { log } = require("./utils/logger");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    log(`Analytics service running on port ${PORT}`);
    await startConsumer();
});

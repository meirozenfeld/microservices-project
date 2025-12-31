const express = require("express");
const healthRoutes = require("./routes/health.routes");
const metricsRoutes = require("./routes/metrics.routes");
const summaryRoutes = require("./routes/summary.routes");

const app = express();

app.use(express.json());

app.use(healthRoutes);
app.use(metricsRoutes);
app.use(summaryRoutes);

module.exports = app;

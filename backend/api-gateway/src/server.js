require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const requestContext = require("./middlewares/requestContext");
const httpLogger = require("./middlewares/httpLogger");
const logger = require("./utils/logger");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const taskRoutes = require("./routes/tasks.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(helmet());
app.use(cors());

app.use(requestContext);
app.use(httpLogger);

// 🟢 routes without body parsing
app.use(healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/analytics", analyticsRoutes);

// 🟢 body parsing only AFTER proxy routes (or not at all in gateway)
app.use(express.json());

// 404
app.use((req, res) => {
    res.status(404).json({ ok: false, error: "Not found" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info({ port }, "api-gateway listening");
});

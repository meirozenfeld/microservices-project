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

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
}));

// ✅ CORS אחד ויחיד, לפני הכל
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// ✅ חובה! טיפול ב־OPTIONS
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});


app.use(requestContext);
app.use(httpLogger);

// routes
app.use(healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/analytics", analyticsRoutes);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info({ port }, "api-gateway listening");
});

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

/* ======================
   Security
====================== */
app.use(
   helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false,
   })
);

/* ======================
   CORS
====================== */
const allowedOrigins = process.env.CORS_ORIGINS
   ? process.env.CORS_ORIGINS.split(",")
   : [];

app.use(
   cors({
      origin: (origin, callback) => {
         // allow server-to-server / curl / health checks
         if (!origin) return callback(null, true);

         if (allowedOrigins.includes(origin)) {
            return callback(null, true);
         }

         return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);


/* ======================
   Observability
====================== */
app.use(requestContext);
app.use(httpLogger);

/* ======================
   Body parsing
   NOTE: Do NOT parse body in gateway - proxy middleware needs raw stream
====================== */

/* ======================
   Routes
====================== */
app.use(healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/analytics", analyticsRoutes);

/* ======================
   Error handler
====================== */
app.use((err, req, res, next) => {
   logger.error({ err, method: req.method, url: req.url }, "[API GATEWAY] Error");
   res.status(500).json({ error: "Internal server error" });
});

/* ======================
   404 handler
====================== */
app.use((req, res) => {
   logger.warn({ method: req.method, url: req.url }, "[API GATEWAY] 404 - Route not found");
   res.status(404).json({ error: "Not found" });
});

/* ======================
   Start server
====================== */
const port = Number(process.env.PORT || 3000);
app.listen(port, "0.0.0.0", () => {
   logger.info({ port }, "api-gateway listening");
});

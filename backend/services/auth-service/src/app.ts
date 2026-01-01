import express from "express";
import helmet from "helmet";
import { authRouter } from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import { pool } from "./db/pool";

export const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    logger.info(
        { method: req.method, url: req.url },
        "Incoming request"
    );
    next();
});

app.use(authRouter);

app.get("/health", async (_req, res) => {
    try {
        await pool.query("SELECT 1 FROM users LIMIT 1");
        await pool.query("SELECT 1 FROM refresh_tokens LIMIT 1");
        res.json({ ok: true, service: "auth-service" });
    } catch {
        res.status(500).json({
            ok: false,
            service: "auth-service",
            error: "DB schema mismatch"
        });
    }
});


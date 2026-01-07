"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const authRoutes_1 = require("./routes/authRoutes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./utils/logger"));
const pool_1 = require("./db/pool");
exports.app = (0, express_1.default)();
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, helmet_1.default)());
exports.app.use(express_1.default.json());
// Log all requests
exports.app.use((req, res, next) => {
    logger_1.default.info({ method: req.method, url: req.url }, "Incoming request");
    next();
});
exports.app.use(authRoutes_1.authRouter);
exports.app.get("/health", async (_req, res) => {
    try {
        await pool_1.pool.query("SELECT 1 FROM users LIMIT 1");
        await pool_1.pool.query("SELECT 1 FROM refresh_tokens LIMIT 1");
        res.json({ ok: true, service: "auth-service" });
    }
    catch {
        res.status(500).json({
            ok: false,
            service: "auth-service",
            error: "DB schema mismatch"
        });
    }
});

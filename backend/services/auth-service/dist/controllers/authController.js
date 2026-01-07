"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const userRepo_1 = require("../repositories/userRepo");
const refreshTokenRepo_1 = require("../repositories/refreshTokenRepo");
const jwtService_1 = require("../services/jwtService");
const logger_1 = __importDefault(require("../utils/logger"));
/* ======================
   Schemas
====================== */
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
/* ======================
   Register
====================== */
async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input" });
    }
    const { email, password } = parsed.data;
    const existing = await (0, userRepo_1.findUserByEmail)(email);
    if (existing) {
        return res.status(409).json({ error: "Email already exists" });
    }
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
    // 1️⃣ יצירת משתמש – שלב קריטי
    let user;
    try {
        user = await (0, userRepo_1.createUser)(email, passwordHash);
    }
    catch (err) {
        logger_1.default.error({ err, email }, "User creation failed");
        return res.status(500).json({ error: "Registration failed" });
    }
    // 2️⃣ access token – תמיד נוצר אם המשתמש קיים
    const accessToken = (0, jwtService_1.signAccessToken)({
        sub: user.id,
        email: user.email,
    });
    // 3️⃣ refresh token + cookie – best effort (לא מפיל רישום)
    try {
        const refreshToken = (0, jwtService_1.signRefreshToken)({ sub: user.id });
        const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);
        const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
        await (0, refreshTokenRepo_1.storeRefreshToken)({
            userId: user.id,
            token: refreshToken,
            expiresAt,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: ttlDays * 24 * 60 * 60 * 1000,
        });
    }
    catch (err) {
        logger_1.default.warn({ err, userId: user.id, email: user.email }, "Refresh token creation failed – continuing without refresh token");
    }
    // 4️⃣ הצלחה – תמיד אם המשתמש נוצר
    return res.status(201).json({ accessToken });
}
/* ======================
   Login
====================== */
async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid input",
            details: parsed.error.flatten(),
        });
    }
    const { email, password } = parsed.data;
    const user = await (0, userRepo_1.findUserByEmail)(email);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = await bcrypt_1.default.compare(password, user.password_hash);
    if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const accessToken = (0, jwtService_1.signAccessToken)({
        sub: user.id,
        email: user.email,
    });
    const refreshToken = (0, jwtService_1.signRefreshToken)({
        sub: user.id,
    });
    const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    await (0, refreshTokenRepo_1.storeRefreshToken)({
        userId: user.id,
        token: refreshToken,
        expiresAt,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ttlDays * 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
}
/* ======================
   Refresh
====================== */
async function refresh(req, res) {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({ error: "Missing refresh token" });
    }
    let payload;
    try {
        payload = (0, jwtService_1.verifyRefreshToken)(token);
    }
    catch {
        return res.status(401).json({ error: "Invalid refresh token" });
    }
    const inDb = await (0, refreshTokenRepo_1.findRefreshToken)(token);
    if (!inDb) {
        return res.status(401).json({ error: "Refresh token revoked" });
    }
    // rotation
    await (0, refreshTokenRepo_1.deleteRefreshToken)(token);
    const user = await (0, userRepo_1.findUserById)(payload.sub);
    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }
    const newAccessToken = (0, jwtService_1.signAccessToken)({
        sub: user.id,
        email: user.email,
    });
    const newRefreshToken = (0, jwtService_1.signRefreshToken)({
        sub: user.id,
    });
    const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    await (0, refreshTokenRepo_1.storeRefreshToken)({
        userId: user.id,
        token: newRefreshToken,
        expiresAt,
    });
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ttlDays * 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken: newAccessToken });
}
/* ======================
   Logout
====================== */
async function logout(req, res) {
    const token = req.cookies?.refreshToken;
    if (token) {
        await (0, refreshTokenRepo_1.deleteRefreshToken)(token);
    }
    res.clearCookie("refreshToken", { path: "/" });
    return res.json({ ok: true });
}

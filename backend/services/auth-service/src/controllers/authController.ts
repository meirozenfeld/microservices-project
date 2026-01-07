import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";

import {
    createUser,
    findUserByEmail,
    findUserById,
} from "../repositories/userRepo";

import {
    storeRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
} from "../repositories/refreshTokenRepo";

import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../services/jwtService";

// ⚠️ יישאר מיובא – נחזיר שימוש בהמשך
import { createUserProfile } from "../services/userClient";

import logger from "../utils/logger";

/* ======================
   Schemas
====================== */

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
const isProd = process.env.NODE_ENV === "production";

/* ======================
   Register
====================== */

export async function register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const { email, password } = parsed.data;

    const existing = await findUserByEmail(email);
    if (existing) {
        return res.status(409).json({ error: "Email already exists" });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 1️⃣ יצירת משתמש – שלב קריטי
    let user;
    try {
        user = await createUser(email, passwordHash);
    } catch (err) {
        logger.error({ err, email }, "User creation failed");
        return res.status(500).json({ error: "Registration failed" });
    }

    // 2️⃣ access token – תמיד נוצר אם המשתמש קיים
    const accessToken = signAccessToken({
        sub: user.id,
        email: user.email,
    });

    // 3️⃣ refresh token + cookie – best effort (לא מפיל רישום)
    try {
        const refreshToken = signRefreshToken({ sub: user.id });

        const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);
        const expiresAt = new Date(
            Date.now() + ttlDays * 24 * 60 * 60 * 1000
        );

        await storeRefreshToken({
            userId: user.id,
            token: refreshToken,
            expiresAt,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd,
            path: "/",
            maxAge: ttlDays * 24 * 60 * 60 * 1000,
        });
    } catch (err) {
        logger.warn(
            { err, userId: user.id, email: user.email },
            "Refresh token creation failed – continuing without refresh token"
        );
    }

    // 4️⃣ הצלחה – תמיד אם המשתמש נוצר
    return res.status(201).json({ accessToken });

}

/* ======================
   Login
====================== */

export async function login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Invalid input",
            details: parsed.error.flatten(),
        });
    }

    const { email, password } = parsed.data;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = signAccessToken({
        sub: user.id,
        email: user.email,
    });

    const refreshToken = signRefreshToken({
        sub: user.id,
    });

    const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);
    const expiresAt = new Date(
        Date.now() + ttlDays * 24 * 60 * 60 * 1000
    );

    await storeRefreshToken({
        userId: user.id,
        token: refreshToken,
        expiresAt,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        path: "/",
        maxAge: ttlDays * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
}

/* ======================
   Refresh
====================== */

export async function refresh(req: Request, res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({ error: "Missing refresh token" });
    }

    let payload: { sub: string };

    try {
        payload = verifyRefreshToken(token);
    } catch {
        return res.status(401).json({ error: "Invalid refresh token" });
    }

    const inDb = await findRefreshToken(token);
    if (!inDb) {
        return res.status(401).json({ error: "Refresh token revoked" });
    }

    // rotation
    await deleteRefreshToken(token);

    const user = await findUserById(payload.sub);
    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }

    const newAccessToken = signAccessToken({
        sub: user.id,
        email: user.email,
    });

    const newRefreshToken = signRefreshToken({
        sub: user.id,
    });

    const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);
    const expiresAt = new Date(
        Date.now() + ttlDays * 24 * 60 * 60 * 1000
    );

    await storeRefreshToken({
        userId: user.id,
        token: newRefreshToken,
        expiresAt,
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        path: "/",
        maxAge: ttlDays * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken: newAccessToken });
}

/* ======================
   Logout
====================== */

export async function logout(req: Request, res: Response) {
    const token = req.cookies?.refreshToken;

    if (token) {
        await deleteRefreshToken(token);
    }

    res.clearCookie("refreshToken", { path: "/" });
    return res.json({ ok: true });
}

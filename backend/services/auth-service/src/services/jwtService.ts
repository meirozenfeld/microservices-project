import jwt from "jsonwebtoken";

function mustGetEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

const accessSecret = mustGetEnv("JWT_ACCESS_SECRET");
const refreshSecret = mustGetEnv("JWT_REFRESH_SECRET");

export function signAccessToken(payload: { sub: string; email: string }) {
    const ttlMin = Number(process.env.ACCESS_TOKEN_TTL_MIN || 15);
    return jwt.sign(payload, accessSecret, { expiresIn: `${ttlMin}m` });
}

export function signRefreshToken(payload: { sub: string }) {
    const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);
    return jwt.sign(payload, refreshSecret, { expiresIn: `${ttlDays}d` });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, accessSecret) as { sub: string; email: string; iat: number; exp: number };
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, refreshSecret) as { sub: string; iat: number; exp: number };
}

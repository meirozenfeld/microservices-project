"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function mustGetEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env: ${name}`);
    return v;
}
const accessSecret = mustGetEnv("JWT_ACCESS_SECRET");
const refreshSecret = mustGetEnv("JWT_REFRESH_SECRET");
function signAccessToken(payload) {
    const ttlMin = Number(process.env.ACCESS_TOKEN_TTL_MIN || 15);
    return jsonwebtoken_1.default.sign(payload, accessSecret, { expiresIn: `${ttlMin}m` });
}
function signRefreshToken(payload) {
    const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14);
    return jsonwebtoken_1.default.sign(payload, refreshSecret, { expiresIn: `${ttlDays}d` });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, accessSecret);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, refreshSecret);
}

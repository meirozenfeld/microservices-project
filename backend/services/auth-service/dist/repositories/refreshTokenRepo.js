"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRefreshToken = storeRefreshToken;
exports.findRefreshToken = findRefreshToken;
exports.deleteRefreshToken = deleteRefreshToken;
exports.deleteAllRefreshTokensForUser = deleteAllRefreshTokensForUser;
const pool_1 = require("../db/pool");
async function storeRefreshToken(params) {
    await pool_1.pool.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)", [params.userId, params.token, params.expiresAt]);
}
async function findRefreshToken(token) {
    const r = await pool_1.pool.query("SELECT id, user_id, expires_at FROM refresh_tokens WHERE token=$1", [token]);
    return r.rowCount ? r.rows[0] : null;
}
async function deleteRefreshToken(token) {
    await pool_1.pool.query("DELETE FROM refresh_tokens WHERE token=$1", [token]);
}
async function deleteAllRefreshTokensForUser(userId) {
    await pool_1.pool.query("DELETE FROM refresh_tokens WHERE user_id=$1", [userId]);
}

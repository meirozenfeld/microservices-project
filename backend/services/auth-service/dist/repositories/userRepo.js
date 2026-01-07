"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
const pool_1 = require("../db/pool");
async function findUserByEmail(email) {
    const r = await pool_1.pool.query("SELECT id, email, password_hash FROM users WHERE email=$1", [email]);
    return r.rowCount ? r.rows[0] : null;
}
async function findUserById(id) {
    const r = await pool_1.pool.query("SELECT id, email, password_hash FROM users WHERE id=$1", [id]);
    return r.rowCount ? r.rows[0] : null;
}
async function createUser(email, passwordHash) {
    const r = await pool_1.pool.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email", [email, passwordHash]);
    return r.rows[0];
}

import { pool } from "../db/pool";

export async function storeRefreshToken(params: {
    userId: string;
    token: string;
    expiresAt: Date;
}) {
    await pool.query(
        "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
        [params.userId, params.token, params.expiresAt]
    );
}

export async function findRefreshToken(token: string) {
    const r = await pool.query<{ id: string; user_id: string; expires_at: Date }>(
        "SELECT id, user_id, expires_at FROM refresh_tokens WHERE token=$1",
        [token]
    );
    return r.rowCount ? r.rows[0] : null;
}

export async function deleteRefreshToken(token: string) {
    await pool.query("DELETE FROM refresh_tokens WHERE token=$1", [token]);
}

export async function deleteAllRefreshTokensForUser(userId: string) {
    await pool.query("DELETE FROM refresh_tokens WHERE user_id=$1", [userId]);
}

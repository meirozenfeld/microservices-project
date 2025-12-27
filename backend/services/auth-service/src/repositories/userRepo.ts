import { pool } from "../db/pool";

export type DbUser = {
    id: string;
    email: string;
    password_hash: string;
};

export async function findUserByEmail(email: string): Promise<DbUser | null> {
    const r = await pool.query<DbUser>(
        "SELECT id, email, password_hash FROM users WHERE email=$1",
        [email]
    );
    return r.rowCount ? r.rows[0] : null;
}

export async function findUserById(id: string): Promise<DbUser | null> {
    const r = await pool.query<DbUser>(
        "SELECT id, email, password_hash FROM users WHERE id=$1",
        [id]
    );
    return r.rowCount ? r.rows[0] : null;
}

export async function createUser(email: string, passwordHash: string): Promise<{ id: string; email: string }> {
    const r = await pool.query<{ id: string; email: string }>(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
        [email, passwordHash]
    );
    return r.rows[0];
}

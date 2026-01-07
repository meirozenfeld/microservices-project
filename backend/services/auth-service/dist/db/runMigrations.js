"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pool_1 = require("./pool");
async function runMigrations() {
    const migrationsDir = path_1.default.join(__dirname, "migrations");
    const files = fs_1.default
        .readdirSync(migrationsDir)
        .filter(f => f.endsWith(".sql"))
        .sort();
    for (const file of files) {
        const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), "utf8");
        await pool_1.pool.query(sql);
        console.log(`✅ migration applied: ${file}`);
    }
    await pool_1.pool.end();
}
runMigrations().catch(err => {
    console.error("❌ migration failed", err);
    process.exit(1);
});

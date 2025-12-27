import fs from "fs";
import path from "path";
import { pool } from "./pool";

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");

  const files = fs
    .readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(
      path.join(migrationsDir, file),
      "utf8"
    );

    await pool.query(sql);
    console.log(`✅ migration applied: ${file}`);
  }

  await pool.end();
}

runMigrations().catch(err => {
  console.error("❌ migration failed", err);
  process.exit(1);
});

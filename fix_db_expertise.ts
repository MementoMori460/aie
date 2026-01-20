
import { Database } from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "sqlite.db");
const db = new (await import("better-sqlite3")).default(dbPath);

console.log("Adding 'expertise' column to users table...");

try {
    // Check if column exists first to avoid error
    const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
    const hasExpertise = tableInfo.some(col => col.name === 'expertise');

    if (!hasExpertise) {
        db.prepare("ALTER TABLE users ADD COLUMN expertise TEXT").run();
        console.log("✅ 'expertise' column added successfully.");
    } else {
        console.log("ℹ️ 'expertise' column already exists.");
    }

} catch (error) {
    console.error("❌ Error modifying database:", error);
}

console.log("Database schema update complete.");

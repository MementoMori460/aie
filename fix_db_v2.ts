
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sqlite.db');
const db = new Database(dbPath);

console.log("Safely updating database schema...");

// 1. Add isBlocked to users
try {
    const customInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
    const hasColumn = customInfo.some(c => c.name === 'isBlocked');

    if (!hasColumn) {
        console.log("Adding isBlocked column to users...");
        // SQLite doesn't strictly support BOOLEAN, uses INTEGER (0/1). 
        // We set default to 0 (false).
        db.prepare('ALTER TABLE users ADD COLUMN isBlocked integer NOT NULL DEFAULT 0').run();
        console.log("isBlocked added.");
    } else {
        console.log("isBlocked column already exists.");
    }
} catch (e: any) {
    console.log("Error adding isBlocked:", e.message);
}

// 2. Create aiPrompts table
try {
    console.log("Creating aiPrompts table if not exists...");
    db.prepare(`
    CREATE TABLE IF NOT EXISTS aiPrompts (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      promptText text NOT NULL,
      isActive integer NOT NULL DEFAULT 0,
      createdBy integer NOT NULL,
      createdAt integer NOT NULL DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
    )
  `).run();
    console.log("aiPrompts table handled."); // Drizzle uses ms timestamp, simplified default here or handled by app
} catch (e: any) {
    console.log("Error creating aiPrompts:", e.message);
}

console.log("Done.");

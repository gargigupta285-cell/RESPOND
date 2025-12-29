import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path - stored in backend directory
const DB_PATH = path.join(__dirname, '..', '..', 'respond.db');

// Create singleton database instance
const db: DatabaseType = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

/**
 * Initialize the database schema
 * Reads and executes schema.sql to create tables if they don't exist
 */
export function initializeDatabase(): void {
    const schemaPath = path.join(__dirname, 'schema.sql');

    if (!fs.existsSync(schemaPath)) {
        console.error('❌ schema.sql not found at:', schemaPath);
        return;
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('✅ Database schema initialized');
}

/**
 * Generate a unique ID with a prefix
 */
export function generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default db;

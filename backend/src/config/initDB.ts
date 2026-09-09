import { pool } from "./database";

export async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS emails (
      id UUID PRIMARY KEY,
      recipient VARCHAR(255) NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      scheduled_at TIMESTAMP NOT NULL,
      sent_at TIMESTAMP,
      status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
      error TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Database initialized");
}
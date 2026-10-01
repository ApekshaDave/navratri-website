import pkg from 'pg';
const { Client } = pkg;
import { mkdirSync, writeFileSync } from 'node:fs';

const DATABASE_URL = process.env.NEON_DATABASE_URL;
if (!DATABASE_URL) {
  console.error('NEON_DATABASE_URL is not set. Add it to .env (see .env.example).');
  process.exit(1);
}

const OUT_DIR = 'migration-data';
const TABLES = ['garbas', 'audio_comments'];

async function exportTables() {
  console.log('🚀 Connecting to Neon PostgreSQL...');
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  mkdirSync(OUT_DIR, { recursive: true });

  for (const table of TABLES) {
    try {
      const { rows } = await client.query(`SELECT * FROM ${table} ORDER BY created_at`);
      writeFileSync(`${OUT_DIR}/${table}.json`, JSON.stringify(rows, null, 2));
      console.log(`  └─ Exported ${rows.length} rows from ${table}`);
    } catch (err) {
      console.warn(`  └─ Skipped ${table}:`, (err as Error).message);
    }
  }

  console.log(`🎉 Export finished. Files are in ./${OUT_DIR}/`);
  await client.end();
}

exportTables().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});

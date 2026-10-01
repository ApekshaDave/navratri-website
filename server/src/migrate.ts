/**
 * Manual migration CLI. The API already runs migrations on startup, so this is only for
 * local development or a server with shell access.
 *   node migrate.cjs                         create tables + load built-in Garbas
 *   node migrate.cjs --import migration-data also import the Neon export
 */
import path from 'node:path';
import { pool } from './db.ts';
import { importNeon, runMigrations } from './migrations.ts';

async function main() {
  await runMigrations();

  const importIndex = process.argv.indexOf('--import');
  if (importIndex !== -1) {
    const dir = path.resolve(process.argv[importIndex + 1] ?? 'migration-data');
    console.log(`📥 Importing Neon export from ${dir}...`);
    await importNeon(dir);
  }

  console.log('🎉 Done');
  await pool.end();
}

main().catch(async (err) => {
  console.error('❌ Migration failed:', err);
  await pool.end().catch(() => {});
  process.exit(1);
});

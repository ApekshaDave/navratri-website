// Schema setup, built-in Garba sync and the one-time Neon import.
// Runs automatically when the API starts (see app.ts) and from the migrate.cjs CLI.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { GARBAS_DATA } from '../../src/data/garbas.ts';
import type { Garba } from '../../src/types/index.ts';
import { config } from './config.ts';
import { pool, SCHEMA } from './db.ts';

const DATA_URL_EXT: Record<string, string> = {
  'audio/webm': '.webm',
  'audio/ogg': '.ogg',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/mp4': '.m4a',
};

async function upsertGarba(g: Garba, isBuiltin: boolean, createdAt?: Date) {
  await pool.execute(
    `INSERT INTO garbas
      (id, title, category, deity, is_featured, is_popular, is_builtin, tags, description, artwork_url, lyrics_source, audio_reference, lyrics, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      title = VALUES(title), category = VALUES(category), deity = VALUES(deity),
      is_featured = VALUES(is_featured), is_popular = VALUES(is_popular), is_builtin = VALUES(is_builtin),
      tags = VALUES(tags), description = VALUES(description), artwork_url = VALUES(artwork_url),
      lyrics_source = VALUES(lyrics_source), audio_reference = VALUES(audio_reference), lyrics = VALUES(lyrics)`,
    [
      g.id,
      JSON.stringify(g.title),
      g.category,
      g.deity || null,
      g.isFeatured ? 1 : 0,
      g.isPopular ? 1 : 0,
      isBuiltin ? 1 : 0,
      JSON.stringify(g.tags || []),
      JSON.stringify(g.description),
      g.artworkUrl || null,
      g.lyricsSource ? JSON.stringify(g.lyricsSource) : null,
      g.audioReference ? JSON.stringify(g.audioReference) : null,
      JSON.stringify(g.lyrics),
      createdAt ?? new Date(),
    ],
  );
}

function readExport(dir: string, table: string): any[] {
  const file = path.join(dir, `${table}.json`);
  if (!existsSync(file)) {
    console.warn(`  └─ ${file} not found, skipping`);
    return [];
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}

// Neon stored comment audio as base64 data URLs; write them out as real files
function saveDataUrlAudio(dataUrl: string | null): string | null {
  const match = dataUrl?.match(/^data:([\w/+.-]+)(?:;[^,]*)?;base64,(.+)$/s);
  if (!match) return null;
  const ext = DATA_URL_EXT[match[1]] ?? '.webm';
  const fileName = `${randomBytes(16).toString('hex')}${ext}`;
  writeFileSync(path.join(config.uploadDir, fileName), Buffer.from(match[2], 'base64'));
  return fileName;
}

export async function importNeon(dir: string) {
  const builtinIds = new Set(GARBAS_DATA.map((g) => g.id));

  const garbas = readExport(dir, 'garbas').filter((row) => !builtinIds.has(row.id));
  for (const row of garbas) {
    await upsertGarba(
      {
        id: row.id,
        title: row.title,
        category: row.category,
        deity: row.deity ?? '',
        isFeatured: row.is_featured,
        isPopular: row.is_popular,
        tags: row.tags,
        description: row.description,
        artworkUrl: row.artwork_url,
        lyricsSource: row.lyrics_source,
        audioReference: row.audio_reference ?? undefined,
        lyrics: row.lyrics,
      },
      false,
      new Date(row.created_at),
    );
  }
  console.log(`  └─ Imported ${garbas.length} user-submitted Garbas`);

  mkdirSync(config.uploadDir, { recursive: true });
  const comments = readExport(dir, 'audio_comments');
  let withAudio = 0;
  for (const row of comments) {
    const audioFile = saveDataUrlAudio(row.audio_url);
    if (audioFile) withAudio++;
    // Imported comments have no delete token, so only an admin (phpMyAdmin) can remove them
    await pool.execute(
      `INSERT IGNORE INTO audio_comments
        (id, garba_id, author_name, comment_text, audio_file, audio_name, likes_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(row.id).slice(0, 64),
        row.garba_id,
        String(row.author_name ?? 'Devotee Singer').slice(0, 80),
        row.comment_text ?? '',
        audioFile,
        audioFile ? row.audio_name ?? null : null,
        Number(row.likes_count) || 0,
        new Date(row.created_at),
      ],
    );
  }
  console.log(`  └─ Imported ${comments.length} comments (${withAudio} with audio files)`);
}

/** Creates missing tables and refreshes built-in Garbas from src/data/garbas.ts. Safe to run repeatedly. */
export async function runMigrations() {
  for (const statement of SCHEMA) await pool.query(statement);
  for (const garba of GARBAS_DATA) await upsertGarba(garba, true);
  console.log(`Migrations done (${GARBAS_DATA.length} built-in Garbas synced)`);
}

/**
 * Imports a Neon export uploaded to <app folder>/migration-data, then renames the folder so it
 * runs only once. Lets the import happen without shell access (FTP-only hosting).
 */
export async function importPendingNeonExport(dir = path.resolve('migration-data')) {
  if (!existsSync(dir)) return;
  console.log(`Found Neon export in ${dir}, importing...`);
  await importNeon(dir);
  renameSync(dir, `${dir}.imported-${Date.now()}`);
}

import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import type { Garba } from '../../../src/types/index.ts';
import { pool, parseJson } from '../db.ts';
import { validateNewGarba } from '../validate.ts';
import { writeLimiter } from '../rateLimit.ts';

export const garbasRouter = Router();

export function rowToGarba(row: RowDataPacket): Garba {
  return {
    id: row.id,
    title: parseJson(row.title),
    category: row.category,
    deity: row.deity ?? '',
    isFeatured: !!row.is_featured,
    isPopular: !!row.is_popular,
    tags: parseJson(row.tags),
    description: parseJson(row.description),
    artworkUrl: row.artwork_url ?? '',
    lyricsSource: parseJson(row.lyrics_source) ?? { name: '', url: '#' },
    audioReference: parseJson(row.audio_reference) ?? undefined,
    lyrics: parseJson(row.lyrics),
  };
}

garbasRouter.get('/garbas', async (_req, res) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM garbas ORDER BY created_at DESC');
  res.json(rows.map(rowToGarba));
});

garbasRouter.post('/garbas', writeLimiter, async (req, res) => {
  const garba: Garba = { id: `custom-garba-${randomBytes(8).toString('hex')}`, ...validateNewGarba(req.body) };

  await pool.execute(
    `INSERT INTO garbas
      (id, title, category, deity, is_featured, is_popular, is_builtin, tags, description, artwork_url, lyrics_source, audio_reference, lyrics)
     VALUES (?, ?, ?, ?, 0, 0, 0, ?, ?, ?, ?, ?, ?)`,
    [
      garba.id,
      JSON.stringify(garba.title),
      garba.category,
      garba.deity || null,
      JSON.stringify(garba.tags),
      JSON.stringify(garba.description),
      garba.artworkUrl,
      JSON.stringify(garba.lyricsSource),
      garba.audioReference ? JSON.stringify(garba.audioReference) : null,
      JSON.stringify(garba.lyrics),
    ],
  );

  res.status(201).json(garba);
});

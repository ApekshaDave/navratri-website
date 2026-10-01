import type { RowDataPacket } from 'mysql2';
import type { Garba, GarbaSummary, LyricsSection } from '../../src/types/index.ts';
import { parseJson } from './db.ts';

// Columns for list views: everything except the large lyrics/audio JSON
export const SUMMARY_COLUMNS =
  'id, title, category, deity, is_featured, is_popular, tags, description, artwork_url, lyrics_source, collection, subcollection';

export function rowToSummary(row: RowDataPacket): GarbaSummary {
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
    collection: row.collection ?? undefined,
    subcollection: row.subcollection ?? undefined,
  };
}

export function rowToGarba(row: RowDataPacket): Garba {
  const lyrics = parseJson<Partial<Garba['lyrics']>>(row.lyrics);
  const sections: LyricsSection[] = lyrics.sections ?? [];
  // Library songs store only sections; derive the flat per-script line lists from them
  const flat = (script: 'gu' | 'hi' | 'en') =>
    lyrics[script]?.length ? lyrics[script]! : sections.flatMap((s) => s.lines[script] ?? []);

  return {
    ...rowToSummary(row),
    audioReference: parseJson(row.audio_reference) ?? undefined,
    lyrics: { gu: flat('gu'), hi: flat('hi'), en: flat('en'), sections },
  };
}

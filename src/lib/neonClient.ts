import type { AudioComment } from '../utils/audioCommentsStorage';

const NEON_REST_URL = import.meta.env.VITE_NEON_REST_URL || 'https://ep-sparkling-surf-azx2ibam.apirest.c-3.ap-southeast-1.aws.neon.tech/neondb/rest/v1';

/**
 * Fetch comments from Neon PostgreSQL Data API for a specific Garba
 */
export async function fetchNeonComments(garbaId: string): Promise<AudioComment[]> {
  try {
    const response = await fetch(`${NEON_REST_URL}/audio_comments?garba_id=eq.${encodeURIComponent(garbaId)}&order=likes_count.desc,created_at.desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Neon REST endpoint returned non-OK status, fallback to localStorage');
      return [];
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      garbaId: item.garba_id,
      userName: item.author_name,
      commentText: item.comment_text,
      audioDataUrl: item.audio_url,
      audioName: item.audio_name,
      likes: item.likes_count || 1,
      userLiked: false,
      isCurrentUser: item.is_current_user || false,
      timestamp: new Date(item.created_at).getTime(),
    }));
  } catch (error) {
    console.error('Error fetching comments from Neon REST API:', error);
    return [];
  }
}

/**
 * Post a new audio comment directly to Neon PostgreSQL Data API
 */
export async function postNeonComment(comment: AudioComment): Promise<boolean> {
  try {
    const response = await fetch(`${NEON_REST_URL}/audio_comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        id: comment.id,
        garba_id: comment.garbaId,
        author_name: comment.userName,
        comment_text: comment.commentText,
        audio_url: comment.audioDataUrl || null,
        audio_name: comment.audioName || null,
        likes_count: comment.likes || 1,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error posting comment to Neon REST API:', error);
    return false;
  }
}

/**
 * Delete comment from Neon PostgreSQL Data API (Owner Checked)
 */
export async function deleteNeonComment(commentId: string): Promise<boolean> {
  try {
    const response = await fetch(`${NEON_REST_URL}/audio_comments?id=eq.${encodeURIComponent(commentId)}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting comment from Neon REST API:', error);
    return false;
  }
}

/**
 * Fetch all Garbas from Neon PostgreSQL Data API
 */
export async function fetchNeonGarbas(): Promise<any[]> {
  try {
    const response = await fetch(`${NEON_REST_URL}/garbas?order=created_at.desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Garbas from Neon REST API:', error);
    return [];
  }
}

/**
 * Post a new Garba to Neon PostgreSQL Data API
 */
export async function postNeonGarba(garba: any): Promise<boolean> {
  try {
    const response = await fetch(`${NEON_REST_URL}/garbas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        id: garba.id,
        title: garba.title,
        category: garba.category,
        deity: garba.deity || null,
        is_featured: garba.isFeatured || false,
        is_popular: garba.isPopular || false,
        tags: garba.tags || [],
        description: garba.description,
        artwork_url: garba.artworkUrl || null,
        lyrics_source: garba.lyricsSource || null,
        audio_reference: garba.audioReference || null,
        lyrics: garba.lyrics,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error posting Garba to Neon REST API:', error);
    return false;
  }
}


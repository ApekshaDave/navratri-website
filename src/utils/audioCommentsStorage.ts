export interface AudioComment {
  id: string;
  garbaId: string;
  userName: string;
  commentText: string;
  audioDataUrl?: string; // Base64 audio string if uploaded/recorded
  audioName?: string;
  audioDuration?: number;
  likes: number;
  userLiked: boolean;
  isCurrentUser?: boolean; // Owner check for deletion
  timestamp: number;
}

const STORAGE_KEY = 'navswar_community_comments_v1';

// Seed initial authentic community comments if empty
const DEFAULT_INITIAL_COMMENTS: Record<string, AudioComment[]> = {
  'amba-abhay-pad-dayini': [
    {
      id: 'comment-seed-1',
      garbaId: 'amba-abhay-pad-dayini',
      userName: 'Rahul Dave',
      commentText: 'Traditional 2-Tali Raas rhythm vocal reference recorded for Navratri 2026 practice!',
      likes: 18,
      userLiked: false,
      timestamp: Date.now() - 86400000 * 2,
    },
    {
      id: 'comment-seed-2',
      garbaId: 'amba-abhay-pad-dayini',
      userName: 'Devangini Patel',
      commentText: 'Aadya Shakti Mahakali stuti vocals with Dhol beat reference.',
      likes: 12,
      userLiked: false,
      timestamp: Date.now() - 86400000 * 5,
    },
  ],
};

function getAllStoredComments(): Record<string, AudioComment[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_COMMENTS));
      return DEFAULT_INITIAL_COMMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading comments from localStorage:', err);
    return DEFAULT_INITIAL_COMMENTS;
  }
}

function saveAllComments(allComments: Record<string, AudioComment[]>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
  } catch (err) {
    console.error('Error saving comments to localStorage:', err);
  }
}

/**
 * Get all community comments for a specific Garba, sorted by Likes descending (Most liked on top)
 */
export function getCommentsForGarba(garbaId: string): AudioComment[] {
  const all = getAllStoredComments();
  const garbaComments = all[garbaId] || [];
  // Sort by Likes descending, then by Timestamp descending
  return [...garbaComments].sort((a, b) => {
    if (b.likes !== a.likes) {
      return b.likes - a.likes; // Highest likes first!
    }
    return b.timestamp - a.timestamp;
  });
}

/**
 * Add a new comment with optional voice reference audio
 */
export function addAudioComment(
  garbaId: string,
  userName: string,
  commentText: string,
  audioDataUrl?: string,
  audioName?: string,
  audioDuration?: number
): AudioComment {
  const all = getAllStoredComments();
  const garbaComments = all[garbaId] || [];

  const newComment: AudioComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    garbaId,
    userName: userName.trim() || 'Devotee Singer',
    commentText: commentText.trim(),
    audioDataUrl,
    audioName,
    audioDuration,
    likes: 1, // Auto start with 1 upvote by author
    userLiked: true,
    isCurrentUser: true, // Marked as owned by current user
    timestamp: Date.now(),
  };

  const updatedGarbaComments = [newComment, ...garbaComments];
  all[garbaId] = updatedGarbaComments;
  saveAllComments(all);

  return newComment;
}

/**
 * Toggle Like / Upvote on a community comment
 */
export function toggleLikeComment(garbaId: string, commentId: string): AudioComment[] {
  const all = getAllStoredComments();
  const garbaComments = all[garbaId] || [];

  const updatedComments = garbaComments.map((comment) => {
    if (comment.id === commentId) {
      const newUserLiked = !comment.userLiked;
      const newLikes = newUserLiked ? comment.likes + 1 : Math.max(0, comment.likes - 1);
      return {
        ...comment,
        userLiked: newUserLiked,
        likes: newLikes,
      };
    }
    return comment;
  });

  all[garbaId] = updatedComments;
  saveAllComments(all);

  // Return re-sorted array (most liked on top)
  return updatedComments.sort((a, b) => b.likes - a.likes || b.timestamp - a.timestamp);
}

/**
 * Delete a user's comment
 */
export function deleteAudioComment(garbaId: string, commentId: string): AudioComment[] {
  const all = getAllStoredComments();
  const garbaComments = all[garbaId] || [];

  const updatedComments = garbaComments.filter((c) => c.id !== commentId);
  all[garbaId] = updatedComments;
  saveAllComments(all);

  return updatedComments;
}

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Heart, Mic, Square, Upload, Play, Pause, Trophy, Trash2, Send, Music2, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  type AudioComment,
  fetchComments,
  postComment,
  setCommentLiked,
  deleteComment,
} from '../lib/apiClient';
import { useLanguage } from '../context/LanguageContext';

const sortByLikes = (list: AudioComment[]) =>
  [...list].sort((a, b) => b.likes - a.likes || b.timestamp - a.timestamp);

interface CommunityAudioCommentsProps {
  garbaId: string;
  garbaTitle: string;
}

export const CommunityAudioComments: React.FC<CommunityAudioCommentsProps> = ({
  garbaId,
  garbaTitle,
}) => {
  const { language } = useLanguage();
  const [comments, setComments] = useState<AudioComment[]>([]);
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [attachedAudio, setAttachedAudio] = useState<Blob | null>(null);
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio Playback State for comments
  const [playingCommentId, setPlayingCommentId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadComments();
    setAttachedAudio(null);
    setUploadedAudioName(null);
  }, [garbaId]);

  const loadComments = async () => {
    try {
      setComments(sortByLikes(await fetchComments(garbaId)));
    } catch (err) {
      console.warn('Failed to load community comments:', err);
      setComments([]);
    }
  };

  // Start Mic Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAttachedAudio(audioBlob);
        setUploadedAudioName(mimeType.includes('mp4') ? 'Voice_Recording.m4a' : 'Voice_Recording.webm');
        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Microphone access is required to record voice. You can also upload an audio file below!');
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Audio file size should be less than 10MB.');
      return;
    }

    setAttachedAudio(file);
    setUploadedAudioName(file.name);
    setRecordingSeconds(0);
  };

  // Submit New Comment with Voice Reference
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!commentText.trim() && !attachedAudio) {
      alert('Please enter a comment or record/upload an audio reference.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await postComment(garbaId, {
        authorName: userName || 'Devotee Singer',
        commentText,
        audio: attachedAudio || undefined,
        audioName: uploadedAudioName || undefined,
        audioDuration: recordingSeconds || undefined,
      });
      setComments((prev) => sortByLikes([created, ...prev]));
      setCommentText('');
      setAttachedAudio(null);
      setUploadedAudioName(null);
      setRecordingSeconds(0);
    } catch (err) {
      alert(`Could not post your comment: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Like & Re-rank
  const handleLike = async (commentId: string) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;
    try {
      const likes = await setCommentLiked(commentId, !target.userLiked);
      setComments((prev) =>
        sortByLikes(prev.map((c) => (c.id === commentId ? { ...c, likes, userLiked: !target.userLiked } : c)))
      );
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Play / Pause Comment Audio
  const togglePlayCommentAudio = (commentId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingCommentId === commentId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingCommentId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.play();
      setPlayingCommentId(commentId);

      newAudio.onended = () => {
        setPlayingCommentId(null);
      };
    }
  };

  // Delete Comment (Owner Verified)
  const handleDelete = async (commentId: string) => {
    if (confirm('Delete your audio comment?')) {
      try {
        await deleteComment(commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } catch (err) {
        alert(`Could not delete comment: ${(err as Error).message}`);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#600000] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl text-[#FFF8ED]">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#800000] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#FFF8ED]">
              {language === 'gu'
                ? 'સમુદાયના ઓડિયો પ્રતિસાદ અને કમેન્ટ્સ'
                : language === 'hi'
                ? 'समुदाय ऑडियो संदर्भ और टिप्पणियां'
                : 'Community Audio References & Comments'}
            </h3>
            <p className="text-xs text-[#D4AF37] font-medium">
              {language === 'gu'
                ? 'સૌથી વધુ લાઈક્સ વાળા ઓડિયો પ્રતિસાદ ટોચ પર દેખાશે'
                : language === 'hi'
                ? 'सबसे अधिक पसंद किए गए ऑडियो संदर्भ शीर्ष पर दिखाई देंगे'
                : 'Most upvoted audio references automatically rank at the top!'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold bg-[#800000] px-3 py-1 rounded-full border border-[#D4AF37]/50 text-[#D4AF37]">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>

      {/* Add Audio Comment Form */}
      <form onSubmit={handleSubmitComment} className="bg-[#500000] border border-[#D4AF37]/40 rounded-2xl p-5 space-y-4 shadow-inner">
        <h4 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>
            {language === 'gu'
              ? 'તમારો ઓડિયો અથવા કમેન્ટ ઉમેરો'
              : language === 'hi'
              ? 'अपना ऑडियो या टिप्पणी जोड़ें'
              : 'Add Your Voice Reference or Comment'}
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name / Singer Name (e.g. Rahul Patel)"
            className="w-full bg-[#3D0000] text-[#FFF8ED] placeholder-[#FFF8ED]/50 px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 text-xs outline-none focus:border-[#D4AF37]"
          />

          {/* Voice Record & Upload Bar */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-[#800000] hover:bg-[#A00000] text-[#FFF8ED] px-3 py-2.5 rounded-xl border border-[#D4AF37]/50 text-xs font-bold transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Record Voice</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex-1 flex items-center justify-center gap-2 bg-[#B71C1C] text-[#FFF8ED] px-3 py-2.5 rounded-xl border border-[#FFF8ED] text-xs font-bold animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop ({formatTime(recordingSeconds)})</span>
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1 bg-[#3D0000] hover:bg-[#800000] text-[#FFF8ED] px-3 py-2.5 rounded-xl border border-[#D4AF37]/40 text-xs font-bold transition-colors"
              title="Upload audio file"
            >
              <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>

        {/* Audio Attached Status Indicator */}
        {attachedAudio && (
          <div className="flex items-center justify-between bg-[#300000] border border-[#D4AF37]/50 px-3 py-2 rounded-xl text-xs text-[#D4AF37]">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Audio Attached: {uploadedAudioName || 'Voice_Reference.webm'}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setAttachedAudio(null);
                setUploadedAudioName(null);
              }}
              className="text-[10px] text-red-300 hover:underline font-bold"
            >
              Remove Audio
            </button>
          </div>
        )}

        {/* Text Comment Box */}
        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={`Write your experience, rhythm details or lyrics tips for "${garbaTitle}"...`}
          className="w-full bg-[#3D0000] text-[#FFF8ED] placeholder-[#FFF8ED]/50 p-3 rounded-xl border border-[#D4AF37]/40 text-xs outline-none focus:border-[#D4AF37] font-sans"
        ></textarea>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#3B1111] font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:brightness-110 transition-all text-xs disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Posting...' : 'Post Audio Comment'}</span>
          </button>
        </div>
      </form>

      {/* Community Comments Leaderboard List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => {
            const isTopRanked = index === 0 && comment.likes > 0;
            const isPlaying = playingCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                  isTopRanked
                    ? 'bg-gradient-to-r from-[#700000] via-[#800000] to-[#700000] border-2 border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/40'
                    : 'bg-[#500000] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                }`}
              >
                {/* Top Upvoted Leaderboard Badge */}
                {isTopRanked && (
                  <div className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-[#3B1111] font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    <Trophy className="w-3 h-3 text-[#3B1111]" />
                    <span>#1 Most Upvoted Voice Reference</span>
                  </div>
                )}

                {/* Comment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#800000] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#FFF8ED]">{comment.userName}</h5>
                      <span className="text-[10px] text-[#FFF8ED]/60">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Like / Upvote Button */}
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        comment.userLiked
                          ? 'bg-[#B71C1C] text-[#FFF8ED] border-[#D4AF37] shadow-md scale-105'
                          : 'bg-[#3D0000] text-[#FFF8ED]/80 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-current text-[#D4AF37]' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>

                    {/* Owner-Only Delete Dustbin Button */}
                    {comment.isCurrentUser && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 rounded-lg text-red-300 hover:text-red-100 hover:bg-[#800000] border border-red-500/30 transition-colors"
                        title="Delete your own comment"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Audio Reference Player Bar if audio attached */}
                {comment.audioUrl && (
                  <div className="flex items-center gap-3 bg-[#3D0000] border border-[#D4AF37]/40 p-3 rounded-xl">
                    <button
                      onClick={() => togglePlayCommentAudio(comment.id, comment.audioUrl)}
                      className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#3B1111] flex items-center justify-center font-bold shadow-md hover:scale-105 transition-transform"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                        <Music2 className="w-3.5 h-3.5" />
                        <span>{comment.audioName || 'User Voice Reference'}</span>
                      </div>
                      <span className="text-[10px] text-[#FFF8ED]/70">
                        {isPlaying ? 'Playing Audio...' : 'Click play to listen to user voice reference'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Text Comment Content */}
                {comment.commentText && (
                  <p className="text-xs sm:text-sm text-[#FFF8ED]/90 leading-relaxed font-sans pl-1">
                    {comment.commentText}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 bg-[#500000] rounded-2xl border border-[#D4AF37]/20 text-[#FFF8ED]/70 text-xs">
            <MessageSquare className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 opacity-60" />
            <p>No community comments yet. Be the first devotee to record or upload a voice reference!</p>
          </div>
        )}
      </div>

    </div>
  );
};

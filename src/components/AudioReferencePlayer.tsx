import React from 'react';
import { Play, Pause, Volume2, VolumeX, Gauge, Music, Info } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useLanguage } from '../context/LanguageContext';
import type { AudioReference } from '../types';

interface AudioReferencePlayerProps {
  audioReference?: AudioReference;
  title?: string;
}

export const AudioReferencePlayer: React.FC<AudioReferencePlayerProps> = ({
  audioReference,
  title,
}) => {
  const { t } = useLanguage();
  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    togglePlayPause,
    seek,
    setSpeed,
    setVolume,
    toggleMute,
    formatTime,
  } = useAudioPlayer(audioReference?.url);

  if (!audioReference || !audioReference.url) {
    return (
      <div className="bg-[#3B1111]/90 border border-[#D4AF37]/40 rounded-2xl p-6 text-center shadow-lg my-6">
        <div className="w-12 h-12 bg-[#8B0000]/60 rounded-full flex items-center justify-center mx-auto mb-3 border border-[#D4AF37]/50 text-[#D4AF37]">
          <Music className="w-6 h-6" />
        </div>
        <p className="font-serif-heading text-lg text-[#D4AF37] font-semibold">{t.audioPlayer.label}</p>
        <p className="text-sm text-[#FFF8ED]/70 mt-1 font-gujarati">{t.audioPlayer.comingSoon}</p>
      </div>
    );
  }

  const speedOptions = [0.75, 1, 1.25, 1.5];

  return (
    <div className="bg-gradient-to-br from-[#3B1111] via-[#2A0A0A] to-[#4A0000] border-2 border-[#D4AF37]/50 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden my-6">
      {/* Background Decorative Gold Ornament */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Labeling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D4AF37]/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B0000] to-[#B71C1C] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-inner">
            <Music className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-heading text-base md:text-lg font-bold text-gold-gradient tracking-wide uppercase">
                {t.audioPlayer.label}
              </span>
              {audioReference.tempo && (
                <span className="text-[10px] font-sans font-semibold uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                  {audioReference.tempo}
                </span>
              )}
            </div>
            {title && (
              <p className="text-xs text-[#FFF8ED]/80 font-gujarati font-medium mt-0.5">
                {title}
              </p>
            )}
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-[#1A0505] p-1 rounded-xl border border-[#D4AF37]/30 self-start sm:self-auto">
          <span className="text-[11px] text-[#D4AF37] px-2 font-sans flex items-center gap-1 font-semibold">
            <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t.audioPlayer.speed}
          </span>
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => setSpeed(speed)}
              className={`px-2 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                playbackRate === speed
                  ? 'bg-[#D4AF37] text-[#3B1111] shadow-sm'
                  : 'text-[#FFF8ED]/70 hover:text-[#FFF8ED] hover:bg-[#8B0000]/40'
              }`}
            >
              {speed}×
            </button>
          ))}
        </div>
      </div>

      {/* Main Playback & Progress Bar */}
      <div className="mt-5 space-y-4">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#3B1111] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all border border-[#FFF8ED]/50 focus:outline-none"
            aria-label={isPlaying ? "Pause audio reference" : "Play audio reference"}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-[#3B1111]" />
            ) : (
              <Play className="w-7 h-7 fill-[#3B1111] ml-1" />
            )}
          </button>

          {/* Timeline & Time Labels */}
          <div className="flex-1 space-y-1.5">
            <div className="relative">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-2 bg-[#1A0505] rounded-lg appearance-none cursor-pointer accent-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-xs font-mono font-medium text-[#FFF8ED]/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2 bg-[#1A0505] px-3 py-1.5 rounded-xl border border-[#D4AF37]/30">
            <button
              onClick={toggleMute}
              className="text-[#D4AF37] hover:text-[#FFF8ED] transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1.5 bg-[#3B1111] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
          </div>
        </div>

        {/* Informational Supporting Disclaimer */}
        <div className="flex items-start gap-2 bg-[#8B0000]/20 p-2.5 rounded-xl border border-[#D4AF37]/20 text-xs text-[#FFF8ED]/80">
          <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <p className="font-gujarati leading-relaxed">
            {t.audioPlayer.supportingText}
          </p>
        </div>
      </div>
    </div>
  );
};

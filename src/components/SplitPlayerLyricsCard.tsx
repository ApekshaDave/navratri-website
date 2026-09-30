import React, { useState } from 'react';
import { Play, Pause, Volume2, Mic, BookOpen, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserAudioRecorder } from './UserAudioRecorder';
import type { Garba } from '../types';

interface SplitPlayerLyricsCardProps {
  garba: Garba;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenLyricsModal: () => void;
}

export const SplitPlayerLyricsCard: React.FC<SplitPlayerLyricsCardProps> = ({
  garba,
  isFavorite,
  onToggleFavorite,
  onOpenLyricsModal,
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'lyrics' | 'meaning' | 'about'>('lyrics');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 272; // 4:32 in seconds

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const title = garba.title[language] || garba.title.gu;
  const lyricsLines = garba.lyrics[language] || garba.lyrics.gu;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-br from-[#6A0000] via-[#550000] to-[#400000] border-2 border-[#D4AF37] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-[#FFF8ED]">
        
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B71C1C]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
          
          {/* Column 1: Image Thumbnail & Overlay Play */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-xl group min-h-[220px] bg-[#400000] flex items-center justify-center">
            <img
              src={garba.artworkUrl}
              alt={garba.title.en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#400000] via-transparent to-transparent"></div>

            {/* Play Button Overlay */}
            <button
              onClick={togglePlay}
              className="absolute w-16 h-16 rounded-full bg-[#8B0000]/90 border-2 border-[#D4AF37] text-[#FFF8ED] flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-[#B71C1C] transition-all group/btn"
              aria-label={isPlaying ? 'Pause reference audio' : 'Play reference audio'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-[#D4AF37]" />
              ) : (
                <Play className="w-7 h-7 text-[#D4AF37] ml-1" />
              )}
            </button>

            {/* Quick Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-[#8B0000]/90 text-[#FFF8ED] text-xs font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/50 backdrop-blur-md">
                {garba.category}
              </span>
            </div>
          </div>

          {/* Column 2: Title, Audio Reference & Scrubber */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                    {garba.deity}
                  </span>
                  <span className="text-xs font-bold text-[#FFF8ED]/70 bg-[#8B0000]/40 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                    Traditional 3-Tali
                  </span>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={onToggleFavorite}
                  className={`p-2 rounded-full border transition-all ${
                    isFavorite
                      ? 'bg-[#8B0000] text-[#D4AF37] border-[#D4AF37]'
                      : 'bg-[#2D0505] text-[#FFF8ED]/70 border-[#D4AF37]/30 hover:text-[#D4AF37]'
                  }`}
                  aria-label="Toggle favorite"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
                </button>
              </div>

              {/* Garba Title */}
              <h2 className="font-serif-heading text-2xl md:text-3xl font-extrabold text-[#FFF8ED] mt-2 leading-tight">
                {title}
              </h2>
            </div>

            {/* Audio Scrubber Controls */}
            <div className="bg-[#1A0505]/80 p-4 rounded-2xl border border-[#D4AF37]/30 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-[#8B0000] border border-[#D4AF37] flex items-center justify-center text-[#FFF8ED] hover:bg-[#B71C1C] transition-colors shrink-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5 text-[#D4AF37]" /> : <Play className="w-5 h-5 text-[#D4AF37] ml-0.5" />}
                </button>

                {/* Scrubber Bar */}
                <div className="flex-1 space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#3B1111] accent-[#D4AF37] rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#FFF8ED]/60 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{garba.audioReference?.duration || '04:32'}</span>
                  </div>
                </div>

                <Volume2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
              </div>

              {/* Helper text */}
              <p className="text-[11px] text-[#FFF8ED]/70 flex items-center gap-1.5 font-sans">
                <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {language === 'gu'
                    ? 'તમારો અવાજ રેકોર્ડ કરો અથવા રાગ અને લય જાણવા સાંભળો.'
                    : language === 'hi'
                    ? 'अपना वॉइस रेफरेंस रिकॉर्ड करें या राग समझने के लिए सुनें।'
                    : 'Record your voice or listen to learn tune & chorus.'}
                </span>
              </p>
            </div>

            {/* Voice Reference Audio Recorder Component */}
            <UserAudioRecorder garbaId={garba.id} title={title} />
          </div>

          {/* Column 3: Interactive Lyrics Box with Tabs */}
          <div className="lg:col-span-3 bg-[#1A0505]/90 border border-[#D4AF37]/40 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-1 border-b border-[#D4AF37]/30 pb-2">
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                  activeTab === 'lyrics'
                    ? 'bg-[#8B0000] text-[#FFF8ED] border border-[#D4AF37]'
                    : 'text-[#FFF8ED]/70 hover:text-[#FFF8ED]'
                }`}
              >
                {language === 'gu' ? 'સાહિત્ય' : language === 'hi' ? 'बोल' : 'Lyrics'}
              </button>
              <button
                onClick={() => setActiveTab('meaning')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                  activeTab === 'meaning'
                    ? 'bg-[#8B0000] text-[#FFF8ED] border border-[#D4AF37]'
                    : 'text-[#FFF8ED]/70 hover:text-[#FFF8ED]'
                }`}
              >
                {language === 'gu' ? 'ભાવાર્થ' : language === 'hi' ? 'अर्थ' : 'Meaning'}
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                  activeTab === 'about'
                    ? 'bg-[#8B0000] text-[#FFF8ED] border border-[#D4AF37]'
                    : 'text-[#FFF8ED]/70 hover:text-[#FFF8ED]'
                }`}
              >
                {language === 'gu' ? 'મહત્વ' : language === 'hi' ? 'परिचय' : 'About'}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto max-h-48 custom-scrollbar space-y-2 text-xs leading-relaxed text-[#FFF8ED]/90 pr-1">
              {activeTab === 'lyrics' && (
                <div className="space-y-2 font-gujarati">
                  {lyricsLines.map((line, idx) => (
                    <p key={idx} className="font-bold text-[#FFF8ED]">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {activeTab === 'meaning' && (
                <p className="font-sans text-[#FFF8ED]/80 italic">
                  {garba.description.en}
                </p>
              )}

              {activeTab === 'about' && (
                <div className="space-y-2 font-sans text-xs">
                  <p><strong className="text-[#D4AF37]">Deity:</strong> {garba.deity}</p>
                  <p><strong className="text-[#D4AF37]">Category:</strong> {garba.category}</p>
                  <p><strong className="text-[#D4AF37]">Rhythm:</strong> Traditional 3-Tali Garba</p>
                </div>
              )}
            </div>

            {/* Full Screen View Lyrics CTA */}
            <button
              onClick={onOpenLyricsModal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#B71C1C] text-[#FFF8ED] text-xs font-bold border border-[#D4AF37] flex items-center justify-center gap-2 hover:from-[#A00000] hover:to-[#C81D1D] transition-all shadow-lg"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>
                {language === 'gu'
                  ? 'સંપૂર્ણ સાહિત્ય વાંચો'
                  : language === 'hi'
                  ? 'पूरा साहित्य पढ़ें'
                  : 'Read Full Lyrics'}
              </span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

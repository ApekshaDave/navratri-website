import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import type { Garba } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LyricsLanguageTabs } from './LyricsLanguageTabs';
import { CommunityAudioComments } from './CommunityAudioComments';
import { SourceAttribution } from './SourceAttribution';
import { ShareModal } from './ShareModal';
import { prettifySlug, sectionLabel } from '../data/library';

interface LyricsViewerProps {
  garba: Garba;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  defaultTab?: 'lyrics' | 'audio';
}

export const LyricsViewer: React.FC<LyricsViewerProps> = ({
  garba,
  onBack,
  isFavorite,
  onToggleFavorite,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Active primary title based on current language
  const primaryTitle = garba.title[language] || garba.title.gu;
  const secondaryTitle = language === 'en' ? garba.title.gu : garba.title.en;
  // Songs from the wider library (bhajans, ragas, stavans...) aren't Maa Amba garbas
  const isLibrarySong = !!garba.collection && garba.collection !== 'navratri';

  return (
    <div className="min-h-screen bg-[#800000] py-8 md:py-12 px-4 sm:px-6 lg:px-8 text-[#FFF8ED]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#D4AF37]/30">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#600000] text-[#D4AF37] border border-[#D4AF37]/60 text-sm font-bold shadow-md hover:bg-[#800000] hover:text-[#FFF8ED] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.lyricsView.backToGarbas}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Category Badge */}
            <span className="text-xs font-bold uppercase tracking-wider bg-[#600000] text-[#FFF8ED] px-3 py-1 rounded-full border border-[#D4AF37]">
              🌺 {isLibrarySong ? sectionLabel(garba.collection, language) : `${garba.category} Garba`}
            </span>
          </div>
        </div>

        {/* Digital Book Outer Cover Frame - Pure Devotional Red */}
        <div className="bg-[#6A0000] border-4 border-[#D4AF37] rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden text-[#FFF8ED]">
          
          {/* Ornate Gold Corner Accent Highlights */}
          <div className="absolute top-3 left-3 text-2xl text-[#D4AF37] opacity-60 pointer-events-none">⚜️</div>
          <div className="absolute top-3 right-3 text-2xl text-[#D4AF37] opacity-60 pointer-events-none">⚜️</div>
          <div className="absolute bottom-3 left-3 text-2xl text-[#D4AF37] opacity-60 pointer-events-none">⚜️</div>
          <div className="absolute bottom-3 right-3 text-2xl text-[#D4AF37] opacity-60 pointer-events-none">⚜️</div>

          {/* Garba Header Section */}
          <div className="text-center space-y-4 pb-8 border-b-2 border-[#D4AF37]/30 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#D4AF37]">
              <span>🪔</span>
              <span>
                {isLibrarySong
                  ? [sectionLabel(garba.collection, language), garba.subcollection && prettifySlug(garba.subcollection)]
                      .filter(Boolean)
                      .join(' · ')
                  : language === 'gu' ? 'મા અંબા ગરબા સાહિત્ય' : language === 'hi' ? 'मां अंबा गरबा साहित्य' : 'Maa Amba Garba Lyrics'}
              </span>
              <span>🪔</span>
            </div>

            {/* Main Primary Title - High Contrast White */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FFF8ED] leading-tight tracking-tight drop-shadow-md ${
              language === 'gu' ? 'font-gujarati' : language === 'hi' ? 'font-hindi' : 'font-serif-title'
            }`}>
              {primaryTitle}
            </h1>

            {/* Secondary & Transliteration Titles */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-base md:text-lg">
              <span className="font-hindi text-[#D4AF37] font-bold">
                {garba.title.hi}
              </span>
              <span className="hidden sm:inline text-[#D4AF37]">•</span>
              <span className="font-serif-heading text-[#FFF8ED]/95 font-semibold tracking-wide">
                {secondaryTitle}
              </span>
            </div>

            {/* Action Bar (Favorite & Share) */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={(e) => onToggleFavorite(garba.id, e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-md ${
                  isFavorite
                    ? 'bg-[#B71C1C] text-[#FFF8ED] border-[#D4AF37]'
                    : 'bg-[#3B1111] text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#8B0000]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? t.lyricsView.favoriteAdded : 'Add Favorite'}</span>
              </button>

              <button
                onClick={() => setShareModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B1111] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold shadow-md hover:bg-[#8B0000] hover:text-[#FFF8ED] transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{t.lyricsView.shareGarba}</span>
              </button>
            </div>
          </div>

          {/* Multilingual Lyrics Language Selector Tabs - Linked to Global setLanguage */}
          <div className="relative z-10 my-6">
            <LyricsLanguageTabs
              activeTab={language}
              onTabChange={setLanguage}
            />
          </div>

          {/* Core Lyrics Render Engine */}
          <div className="mt-8 space-y-8 relative z-10">
            {garba.lyrics.sections && garba.lyrics.sections.length > 0 ? (
              garba.lyrics.sections.map((section, idx) => {
                const isChorus = section.type === 'chorus';
                const linesToRender =
                  section.lines[language] ||
                  section.lines.gu ||
                  [];

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-6 md:p-8 transition-all relative ${
                      isChorus
                        ? 'bg-[#800000] border-2 border-[#D4AF37] shadow-xl text-[#FFF8ED]'
                        : 'bg-[#500000] border border-[#D4AF37]/40 text-[#FFF8ED]'
                    }`}
                  >
                    {/* Section Label Header */}
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#D4AF37]/40">
                      <span className="text-xl">{isChorus ? '🌺' : '🔱'}</span>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider font-sans ${
                          isChorus ? 'text-[#D4AF37]' : 'text-[#FFF8ED]/80'
                        }`}
                      >
                        {section.label?.[language] ||
                          (isChorus ? t.lyricsView.chorusLabel : t.lyricsView.verseLabel)}
                      </span>
                      {isChorus && (
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-[#D4AF37] text-[#3B1111] px-2.5 py-0.5 rounded-full border border-[#FFF8ED]">
                          REPEATED REFRAIN
                        </span>
                      )}
                    </div>

                    {/* Verse Lines */}
                    <div className="space-y-3 text-center sm:text-left">
                      {linesToRender.map((line, lIdx) => (
                        <p
                          key={lIdx}
                          className={`text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide ${
                            language === 'gu'
                              ? 'font-gujarati font-bold text-[#FFF8ED]'
                              : language === 'hi'
                              ? 'font-hindi font-bold text-[#FFF8ED]'
                              : 'font-serif-heading font-semibold text-[#FFF8ED]'
                          } ${isChorus ? 'text-[#D4AF37] drop-shadow-sm font-extrabold' : ''}`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Fallback Simple Lines Render */
              <div className="bg-[#500000] border-2 border-[#D4AF37]/50 rounded-2xl p-6 md:p-8 space-y-4">
                {(garba.lyrics[language] || garba.lyrics.gu).map((line, idx) => (
                  <p
                    key={idx}
                    className={`text-2xl md:text-3xl font-bold text-[#FFF8ED] leading-relaxed ${
                      language === 'gu' ? 'font-gujarati' : language === 'hi' ? 'font-hindi' : 'font-serif-heading'
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Devotional Source Attribution Section */}
          <div className="mt-10 pt-6 border-t-2 border-[#D4AF37]/30 relative z-10">
            <SourceAttribution source={garba.lyricsSource} />
          </div>

          {/* Community Audio References & Comments Section with Likes Ranking */}
          <div className="mt-10 relative z-10">
            <CommunityAudioComments garbaId={garba.id} garbaTitle={primaryTitle} />
          </div>

        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <ShareModal garba={garba} onClose={() => setShareModalOpen(false)} />
      )}
    </div>
  );
};

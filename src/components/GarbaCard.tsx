import React from 'react';
import { BookOpen, Mic, Heart } from 'lucide-react';
import type { GarbaSummary } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GarbaCardProps {
  garba: GarbaSummary;
  onSelect: (garba: GarbaSummary, defaultTab?: 'lyrics' | 'audio') => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const GarbaCard: React.FC<GarbaCardProps> = ({
  garba,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const { language, t } = useLanguage();

  const titleText = garba.title[language] || garba.title.gu;
  const subtitleText = language === 'en' ? garba.title.gu : garba.title.en;

  return (
    <div className="bg-[#FFF8ED] rounded-2xl border-2 border-[#D4AF37]/40 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1 relative">
      {/* Artwork Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-[#3B1111]">
        <img
          src={garba.artworkUrl}
          alt={garba.title.en}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B1111] via-transparent to-black/30"></div>

        {/* Category Tag */}
        <div className="absolute top-3 left-3 bg-[#3B1111]/90 backdrop-blur-sm border border-[#D4AF37] px-3 py-1 rounded-full shadow-md">
          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
            {garba.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(garba.id, e)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#3B1111]/80 backdrop-blur-sm border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] hover:scale-110 active:scale-95 transition-all shadow-md"
          title={isFavorite ? t.lyricsView.favoriteRemoved : t.lyricsView.favoriteAdded}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-[#B71C1C] text-[#B71C1C]' : 'text-[#D4AF37]'
            }`}
          />
        </button>

        {/* Voice Reference Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#8B0000]/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#D4AF37]/40 text-xs text-[#FFF8ED]">
          <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] text-[#D4AF37] font-bold uppercase">Voice Reference</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Main Title based on active language */}
          <h3 className={`text-xl md:text-2xl font-bold text-[#3B1111] leading-tight group-hover:text-[#8B0000] transition-colors ${
            language === 'gu' ? 'font-gujarati' : language === 'hi' ? 'font-hindi' : 'font-serif-heading'
          }`}>
            {titleText}
          </h3>

          {/* Transliteration / Subtitle */}
          <p className="font-serif-heading text-xs font-semibold text-[#8B0000]/80 tracking-wide mt-1">
            {subtitleText}
          </p>

          {/* Description */}
          <p className={`text-xs text-[#3B1111]/80 mt-2 line-clamp-2 leading-relaxed ${
            language === 'gu' ? 'font-gujarati' : language === 'hi' ? 'font-hindi' : 'font-sans'
          }`}>
            {garba.description[language] || garba.description.gu}
          </p>
        </div>

        {/* Card Action Buttons */}
        <div className="pt-3 border-t border-[#D4AF37]/25 flex items-center gap-2">
          {/* Read Lyrics Button */}
          <button
            onClick={() => onSelect(garba, 'lyrics')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#B71C1C] text-[#FFF8ED] text-xs font-bold shadow-md hover:from-[#A00000] hover:to-[#C81D1D] transition-all border border-[#D4AF37]"
          >
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.featured.readLyrics}</span>
          </button>

          {/* Record Voice Button */}
          <button
            onClick={() => onSelect(garba, 'lyrics')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#3B1111] text-[#D4AF37] border border-[#D4AF37]/60 hover:bg-[#8B0000] hover:text-[#FFF8ED] text-xs font-bold transition-all"
            title={t.voiceRecorder.startRecording}
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">{t.featured.listenReference}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

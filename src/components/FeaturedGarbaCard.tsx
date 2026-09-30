import React from 'react';
import { BookOpen, Mic, Heart, Star, Sparkles } from 'lucide-react';
import type { Garba } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FeaturedGarbaCardProps {
  garba: Garba;
  onSelect: (garba: Garba, defaultTab?: 'lyrics' | 'audio') => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const FeaturedGarbaCard: React.FC<FeaturedGarbaCardProps> = ({
  garba,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const { language, t } = useLanguage();

  const titleText = garba.title[language] || garba.title.gu;
  const secondaryTitle = language === 'en' ? garba.title.gu : garba.title.en;

  return (
    <div className="relative bg-gradient-to-br from-[#3B1111] via-[#5C0A0A] to-[#2B0505] rounded-3xl border-4 border-[#D4AF37] p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden card-devotional-shadow text-[#FFF8ED]">
      {/* Background Decorative Mandala Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Artwork Showcase */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl group">
            <img
              src={garba.artworkUrl}
              alt={garba.title.en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3B1111] via-transparent to-black/20"></div>

            {/* Featured Badge */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#3B1111] px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{t.featured.badge}</span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={(e) => onToggleFavorite(garba.id, e)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#1A0505]/80 backdrop-blur-md border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] hover:scale-110 active:scale-95 transition-all shadow-lg"
              title={isFavorite ? t.lyricsView.favoriteRemoved : t.lyricsView.favoriteAdded}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'fill-[#B71C1C] text-[#B71C1C]' : 'text-[#D4AF37]'
                }`}
              />
            </button>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#FFF8ED] bg-[#1A0505]/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-[#D4AF37]/40">
              <span className="font-semibold text-[#D4AF37]">Devotional Garba</span>
              <span className="font-mono text-[#FFF8ED]">Voice Reference Available</span>
            </div>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/40">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.featured.badge}</span>
            </div>

            {/* Main Title based on active language */}
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFF8ED] leading-tight tracking-tight ${
              language === 'gu' ? 'font-gujarati' : language === 'hi' ? 'font-hindi' : 'font-serif-title'
            }`}>
              {titleText}
            </h2>

            {/* Transliteration & Hindi Titles */}
            <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base pt-1">
              <span className="font-hindi text-gold-gradient font-bold">
                {garba.title.hi}
              </span>
              <span className="text-[#D4AF37]">•</span>
              <span className="font-serif-heading text-[#FFF8ED]/90 font-semibold tracking-wide">
                {secondaryTitle}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className={`text-sm sm:text-base text-[#FFF8ED]/90 leading-relaxed max-w-2xl ${
            language === 'gu' ? 'font-gujarati' : language === 'hi' ? 'font-hindi' : 'font-sans'
          }`}>
            {garba.description[language] || garba.description.gu}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={() => onSelect(garba, 'lyrics')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-[#3B1111] font-extrabold text-base shadow-xl hover:scale-105 active:scale-95 transition-all border border-[#FFF8ED]"
            >
              <BookOpen className="w-5 h-5 text-[#3B1111]" />
              <span>{t.featured.readLyrics}</span>
            </button>

            <button
              onClick={() => onSelect(garba, 'lyrics')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-[#1A0505]/80 text-[#D4AF37] font-bold text-base border-2 border-[#D4AF37] shadow-lg hover:bg-[#8B0000] hover:text-[#FFF8ED] transition-all"
            >
              <Mic className="w-5 h-5 text-[#D4AF37]" />
              <span>{t.featured.listenReference}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

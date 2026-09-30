import React from 'react';
import { Music2, LogIn, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import maaDurgaImg from '../assets/maa-durga.jpg';

interface HeroProps {
  onExplore: () => void;
  onBrowseLyrics: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const { language, t } = useLanguage();
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <div className="relative text-[#FFF8ED] overflow-hidden border-b-4 border-[#D4AF37] min-h-[520px] sm:min-h-[600px] md:min-h-[660px] flex items-center bg-[#800000]">
      {/* Full Background Maa Durga Image - Top Aligned for Full Crown Visibility */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={maaDurgaImg} 
          alt="Maa Durga Devotional Background"
          className="w-full h-full object-cover object-[center_top] filter contrast-[1.08] brightness-[1.02]"
        />
      </div>

      {/* Devotional Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#800000] via-[#800000]/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#600000]/50 via-transparent to-[#600000]/50"></div>

      {/* Background Decorative Mandala */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[600px] md:h-[800px] rounded-full border border-[#D4AF37]/20 animate-spin-slow pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 relative z-10 w-full text-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Navratri 2026 Official Festival Dates Announcement Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1A0505]/90 border-2 border-[#D4AF37] px-4 py-2 rounded-full shadow-2xl backdrop-blur-md animate-bounce-subtle">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-serif-heading text-xs sm:text-sm font-bold text-[#D4AF37] tracking-wide">
              {language === 'gu'
                ? '🌸 શારદીય નવરાત્રી ૨૦૨૬: ૧૧ ઓક્ટોબર – ૨૦ ઓક્ટોબર ૨૦૨૬ 🌸'
                : language === 'hi'
                ? '🌸 शारदीय नवरात्रि 2026: 11 अक्टूबर – 20 अक्टूबर 2026 🌸'
                : '🌸 Shardiya Navratri 2026: 11 October – 20 October 2026 🌸'}
            </span>
          </div>

          {/* Main Headings */}
          <div className="space-y-2 sm:space-y-4 min-h-[120px] sm:min-h-[160px] md:min-h-[190px] flex flex-col justify-center">
            <h1 className="font-serif-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#FFF8ED] leading-tight tracking-tight drop-shadow-2xl">
              {t.hero.mainTitle}
            </h1>
            <p className="font-serif-heading text-xl sm:text-3xl md:text-4xl text-gold-gradient font-bold tracking-wider drop-shadow-lg">
              {t.hero.subTitle}
            </p>
          </div>

          {/* Description */}
          <div className="min-h-[64px] sm:min-h-[76px] flex items-center justify-center">
            <p className="text-base sm:text-lg md:text-xl text-[#FFF8ED]/95 font-gujarati leading-relaxed mx-auto drop-shadow-md max-w-3xl px-2">
              {t.hero.description}
            </p>
          </div>

          {/* Action CTAs: Explore Button & Conditional Sign In Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pt-2 sm:pt-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-[#3B1111] font-extrabold text-base sm:text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-[#FFF8ED]"
            >
              <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B1111]" />
              <span>{t.hero.ctaExplore}</span>
            </button>

            {/* Render Sign In Button ONLY when user is NOT signed in */}
            {!isAuthenticated && (
              <button
                onClick={() => openAuthModal()}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4.5 rounded-2xl bg-[#1A0505]/95 text-[#D4AF37] font-extrabold text-base sm:text-lg border-2 border-[#D4AF37] shadow-xl hover:bg-[#8B0000] hover:text-[#FFF8ED] transition-all backdrop-blur-sm"
              >
                <LogIn className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                <span>
                  {language === 'gu'
                    ? 'ગૂગલ સાઇન ઇન'
                    : language === 'hi'
                    ? 'गूगल साइन इन'
                    : 'Sign In with Google'}
                </span>
              </button>
            )}
          </div>

          {/* Guarantees / Badges */}
          <div className="pt-6 sm:pt-8 border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#FFF8ED]/90 font-sans">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold">Multilingual Garba Literature</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold">Audio Voice Reference Recordings</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold">Community Garba Creator</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

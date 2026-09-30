import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Music2, Flame, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Garba } from '../types';

interface PopularSongsCarouselProps {
  garbas: Garba[];
  selectedGarba: Garba;
  onSelectGarba: (garba: Garba) => void;
  onViewAll: () => void;
}

export const PopularSongsCarousel: React.FC<PopularSongsCarouselProps> = ({
  garbas,
  selectedGarba,
  onSelectGarba,
  onViewAll,
}) => {
  const { language } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif-heading text-2xl font-bold text-[#FFF8ED] tracking-wide">
            {language === 'gu' ? 'લોકપ્રિય ગરબા' : language === 'hi' ? 'लोकप्रिय गरबा' : 'Popular Songs'}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewAll}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:text-[#FFF8ED] transition-colors"
          >
            <span>{language === 'gu' ? 'બધા જુઓ' : language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-[#600000] border border-[#D4AF37]/40 flex items-center justify-center text-[#FFF8ED]/80 hover:text-[#FFF8ED] hover:border-[#D4AF37] transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-[#600000] border border-[#D4AF37]/40 flex items-center justify-center text-[#FFF8ED]/80 hover:text-[#FFF8ED] hover:border-[#D4AF37] transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
      >
        {garbas.map((garba) => {
          const isSelected = selectedGarba.id === garba.id;
          const title = garba.title[language] || garba.title.gu;

          return (
            <button
              key={garba.id}
              onClick={() => onSelectGarba(garba)}
              className={`shrink-0 w-52 sm:w-60 rounded-2xl overflow-hidden border transition-all duration-300 text-left group bg-[#6A0000] hover:bg-[#800000] ${
                isSelected
                  ? 'border-2 border-[#D4AF37] shadow-xl shadow-[#600000]/60 scale-[1.02]'
                  : 'border-[#D4AF37]/30 hover:border-[#D4AF37]/70'
              }`}
            >
              {/* Thumbnail Image */}
              <div className="w-full h-32 relative overflow-hidden bg-[#500000]">
                <img
                  src={garba.artworkUrl}
                  alt={garba.title.en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6A0000] via-transparent to-transparent opacity-80"></div>
                
                {/* Category Pill Tag */}
                <span className="absolute bottom-2 left-2 bg-[#8B0000]/90 text-[#FFF8ED] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#D4AF37]/50 backdrop-blur-sm">
                  {garba.category}
                </span>
              </div>

              {/* Title & Info */}
              <div className="p-3 space-y-1">
                <h4 className="font-serif-heading text-sm font-bold text-[#FFF8ED] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                  {title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-[#FFF8ED]/70">
                  <span className="flex items-center gap-1 text-[#D4AF37]">
                    <Music2 className="w-3 h-3" />
                    <span>{garba.deity}</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

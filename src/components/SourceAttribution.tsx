import React from 'react';
import { BookmarkCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { LyricsSource } from '../types';

interface SourceAttributionProps {
  source: LyricsSource;
}

export const SourceAttribution: React.FC<SourceAttributionProps> = ({ source }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FFF8ED] border-2 border-[#D4AF37]/40 rounded-2xl p-4 md:p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#8B0000]/10 border border-[#D4AF37]/50 flex items-center justify-center text-[#8B0000] shrink-0 mt-0.5">
          <BookmarkCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8B0000] uppercase tracking-wider">
              {t.attribution.sourceLabel}
            </span>
            <span className="text-xs font-bold text-[#3B1111] bg-[#D4AF37]/20 px-2 py-0.5 rounded-md border border-[#D4AF37]/40">
              {source.name}
            </span>
          </div>
          <p className="text-xs text-[#3B1111]/70 font-gujarati mt-1 leading-relaxed">
            {t.attribution.disclaimer}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#B71C1C] text-[#FFF8ED] text-xs font-semibold shadow-md border border-[#D4AF37] whitespace-nowrap self-stretch sm:self-auto justify-center">
        <span>{t.attribution.viewOriginal}</span>
      </div>
    </div>
  );
};

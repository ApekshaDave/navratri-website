import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import navswarLogo from '../assets/navswar_logo.png';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#600000] border-t-4 border-[#D4AF37] text-[#FFF8ED] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Brand & Devotional Mission */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] shadow-lg bg-[#400000] p-0.5">
              <img src={navswarLogo} alt="NavSwar Emblem" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="font-serif-title text-2xl font-bold text-gold-gradient">
              {t.brandName}
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#FFF8ED]/80 font-gujarati leading-relaxed max-w-md">
            {t.footer.disclaimer}
          </p>
        </div>

        {/* Source Attribution & Quick Note */}
        <div className="md:col-span-6 space-y-2 text-left md:text-right border-t md:border-t-0 md:border-l border-[#D4AF37]/20 pt-6 md:pt-0 md:pl-8">
          <div className="inline-flex items-center gap-2 bg-[#3B1111] px-3 py-1 rounded-full border border-[#D4AF37]/40 text-xs font-semibold text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.attribution.sourceLabel}</span>
          </div>
          <p className="text-xs text-[#FFF8ED]/70 font-serif-heading pt-2">
            {t.footer.copyright}
          </p>
        </div>

      </div>
    </footer>
  );
};

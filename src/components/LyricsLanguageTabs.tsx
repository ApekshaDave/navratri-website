import React from 'react';
import type { Language } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LyricsLanguageTabsProps {
  activeTab: Language;
  onTabChange: (lang: Language) => void;
}

export const LyricsLanguageTabs: React.FC<LyricsLanguageTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useLanguage();

  const tabs: { id: Language; label: string; sublabel: string }[] = [
    {
      id: 'gu',
      label: t.lyricsView.gujaratiTab,
      sublabel: t.lyricsView.originalGujarati,
    },
    {
      id: 'hi',
      label: t.lyricsView.hindiTab,
      sublabel: t.lyricsView.hindiTranslation,
    },
    {
      id: 'en',
      label: t.lyricsView.englishTab,
      sublabel: t.lyricsView.englishTransliteration,
    },
  ];

  return (
    <div className="bg-[#3B1111] p-1.5 rounded-2xl border-2 border-[#D4AF37]/50 shadow-xl my-6">
      <div className="grid grid-cols-3 gap-1.5">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 focus:outline-none ${
                isSelected
                  ? 'bg-gradient-to-b from-[#8B0000] to-[#B71C1C] text-[#FFF8ED] border-2 border-[#D4AF37] shadow-lg scale-[1.02]'
                  : 'text-[#FFF8ED]/70 hover:text-[#FFF8ED] hover:bg-[#8B0000]/30'
              }`}
            >
              <span
                className={`text-lg md:text-xl font-bold ${
                  tab.id === 'gu'
                    ? 'font-gujarati'
                    : tab.id === 'hi'
                    ? 'font-hindi'
                    : 'font-serif-heading'
                } ${isSelected ? 'text-[#D4AF37]' : ''}`}
              >
                {tab.label}
              </span>
              <span className="text-[10px] md:text-xs text-[#FFF8ED]/70 mt-0.5 truncate hidden sm:inline-block">
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

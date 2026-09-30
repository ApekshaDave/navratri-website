import React from 'react';
import { Music, Flame, Sparkles, Heart, Sun, Feather, Star, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CategoryPillsProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();

  const categories = [
    { id: 'All', labelGu: 'બધા ગરબા', labelHi: 'सभी गरबा', labelEn: 'All Songs', icon: Compass },
    { id: 'Garba', labelGu: 'ગરબા', labelHi: 'गरबा', labelEn: 'Garba', icon: Music },
    { id: 'Bhajan', labelGu: 'ભજન', labelHi: 'भजन', labelEn: 'Bhajan', icon: Heart },
    { id: 'Aarti', labelGu: 'આરતી', labelHi: 'आरती', labelEn: 'Aarti', icon: Flame },
    { id: 'Stuti', labelGu: 'સ્તૃતિ', labelHi: 'स्तुति', labelEn: 'Stuti', icon: Sparkles },
    { id: 'Traditional', labelGu: 'પ્રાચીન / ઢાળ', labelHi: 'पारंपरिक', labelEn: 'Traditional', icon: Sun },
    { id: 'Folk', labelGu: 'લોક સાહિત્ય', labelHi: 'लोक साहित्य', labelEn: 'Folk', icon: Feather },
    { id: 'Trending', labelGu: 'લોકપ્રિય', labelHi: 'ट्रेंडिंग', labelEn: 'Trending', icon: Star },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const label =
            language === 'gu'
              ? cat.labelGu
              : language === 'hi'
              ? cat.labelHi
              : cat.labelEn;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap shadow-md border ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-[#3B1111] border-[#FFF8ED] shadow-lg shadow-[#600000]/60 scale-105 font-extrabold'
                  : 'bg-[#6A0000] text-[#FFF8ED]/90 border-[#D4AF37]/40 hover:bg-[#800000] hover:text-[#FFF8ED] hover:border-[#D4AF37]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#D4AF37]/70'}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

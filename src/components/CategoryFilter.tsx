import React from 'react';
import type { GarbaCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryFilterProps {
  selectedCategory: GarbaCategory;
  onSelectCategory: (category: GarbaCategory) => void;
}

const CATEGORIES: GarbaCategory[] = [
  'All',
  'Traditional',
  'Devotional',
  '3 Tali',
  'Dodhiyu',
  'Hich',
  'Titoda',
  'Aarti',
  'Dakla',
  'Evergreen',
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const label = cat === 'All' ? t.explore.allCategories : cat;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none ${
              isSelected
                ? 'bg-gradient-to-r from-[#8B0000] to-[#B71C1C] text-[#FFF8ED] border-2 border-[#D4AF37] shadow-lg scale-[1.03]'
                : 'bg-[#FFF8ED] text-[#3B1111] border border-[#D4AF37]/50 hover:bg-[#8B0000]/10'
            }`}
          >
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

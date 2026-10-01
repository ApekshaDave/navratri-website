import React from 'react';
import { Heart } from 'lucide-react';
import { GarbaCard } from '../components/GarbaCard';
import type { GarbaSummary } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FavoritesPageProps {
  garbas: GarbaSummary[];
  favoriteIds: string[];
  onSelectGarba: (garba: GarbaSummary, tab?: 'lyrics' | 'audio') => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onNavigateToGarbas: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  garbas,
  favoriteIds,
  onSelectGarba,
  isFavorite,
  onToggleFavorite,
  onNavigateToGarbas,
}) => {
  const { t } = useLanguage();
  const favoriteGarbas = garbas.filter((g) => favoriteIds.includes(g.id));

  return (
    <div className="bg-[#800000] min-h-screen text-[#FFF8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FFF8ED] text-gold-gradient">
            {t.favoritesPage.title}
          </h1>
        </div>

        {/* Grid or Empty State */}
        {favoriteGarbas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteGarbas.map((garba) => (
              <GarbaCard
                key={garba.id}
                garba={garba}
                onSelect={onSelectGarba}
                isFavorite={isFavorite(garba.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#6A0000] border-2 border-[#D4AF37]/40 rounded-3xl p-16 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#800000] border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
              <Heart className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="font-gujarati text-2xl font-bold text-[#FFF8ED]">
              {t.favoritesPage.emptyState}
            </h3>
            <p className="text-xs text-[#FFF8ED]/80 font-sans">
              Bookmark your favorite Garbas by clicking the heart icon on any Garba card.
            </p>
          <button
            onClick={onNavigateToGarbas}
            className="px-8 py-3 rounded-2xl bg-[#8B0000] text-[#FFF8ED] font-bold text-sm border-2 border-[#D4AF37] shadow-lg hover:bg-[#A00000] transition-colors"
          >
            {t.favoritesPage.exploreBtn}
          </button>
          </div>
        )}

      </div>
    </div>
  );
};

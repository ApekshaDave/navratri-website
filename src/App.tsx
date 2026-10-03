import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchBarModal } from './components/SearchBarModal';
import { LyricsViewer } from './components/LyricsViewer';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AddGarbaModal } from './components/AddGarbaModal';
import { Home } from './pages/Home';
import { GarbasPage } from './pages/GarbasPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AboutPage } from './pages/AboutPage';
import { LibraryPage } from './pages/LibraryPage';
import { GARBAS_DATA } from './data/garbas';
import type { Garba, GarbaSummary } from './types';
import { useFavorites } from './hooks/useFavorites';
import { fetchSong, fetchSongs, postGarba } from './lib/apiClient';

type ReturnTab = 'home' | 'garbas' | 'library' | 'favorites';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedGarba, setSelectedGarba] = useState<Garba | null>(null);
  const [defaultTab, setDefaultTab] = useState<'lyrics' | 'audio'>('lyrics');
  const [returnTab, setReturnTab] = useState<ReturnTab>('garbas');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddGarbaOpen, setIsAddGarbaOpen] = useState(false);
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);

  // Navratri garbas from the API (summaries only; lyrics load when a song is opened)
  const [remoteGarbas, setRemoteGarbas] = useState<GarbaSummary[]>([]);
  // Favorited songs from other library sections, which aren't in the Navratri list
  const [extraFavorites, setExtraFavorites] = useState<GarbaSummary[]>([]);

  const { isAuthenticated, openAuthModal } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchSongs({ collection: 'navratri', limit: 1000 })
      .then(({ items }) => {
        const builtinIds = new Set(GARBAS_DATA.map((g) => g.id));
        setRemoteGarbas(items.filter((g) => !builtinIds.has(g.id)));
      })
      .catch((err) => {
        console.warn('Garba API fetch failed, showing built-in collection only:', err);
      });
  }, []);

  // Built-ins ship with full lyrics in the bundle, so they come first and open instantly
  const allGarbas: GarbaSummary[] = [...GARBAS_DATA, ...remoteGarbas];
  const featuredGarba = GARBAS_DATA.find((g) => g.id === 'amba-abhay-pad-dayini') || GARBAS_DATA[0];

  const missingFavoriteIds = favorites
    .filter((id) => !allGarbas.some((g) => g.id === id))
    .join(',');
  useEffect(() => {
    if (!missingFavoriteIds) {
      setExtraFavorites([]);
      return;
    }
    const ids = missingFavoriteIds.split(',');
    fetchSongs({ ids, limit: ids.length })
      .then(({ items }) => setExtraFavorites(items))
      .catch((err) => console.warn('Failed to load favorite songs:', err));
  }, [missingFavoriteIds]);

  // Select Garba: Open lyrics and audio player (public to all users)
  const handleSelectGarba = async (garba: GarbaSummary | Garba, tab: 'lyrics' | 'audio' = 'lyrics') => {
    if (activeTab !== 'lyrics') setReturnTab(activeTab as ReturnTab);

    let full: Garba;
    if ('lyrics' in garba) {
      full = garba;
    } else {
      setLoadingSongId(garba.id);
      try {
        full = await fetchSong(garba.id);
      } catch (e) {
        alert(`Could not load this song: ${(e as Error).message}`);
        return;
      } finally {
        setLoadingSongId(null);
      }
    }

    setSelectedGarba(full);
    setDefaultTab(tab);
    setActiveTab('lyrics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('Please sign in with Google to save your favorite Garbas!');
      return;
    }
    toggleFavorite(id);
  };

  const handleAddCustomGarba = async (newGarba: Garba): Promise<boolean> => {
    try {
      const saved = await postGarba(newGarba);
      setRemoteGarbas((prev) => [saved, ...prev]);
      handleSelectGarba(saved, 'lyrics');
      return true;
    } catch (e) {
      alert(`Could not publish your Garba: ${(e as Error).message}`);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8ED] text-[#3B1111] antialiased">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'favorites' && !isAuthenticated) {
            openAuthModal('Please sign in with Google to access your favorite Garbas!');
            return;
          }
          setActiveTab(tab);
          if (tab !== 'lyrics') setSelectedGarba(null);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            garbas={allGarbas}
            featuredGarba={featuredGarba}
            onSelectGarba={handleSelectGarba}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToGarbas={() => {
              setActiveTab('garbas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'garbas' && (
          <GarbasPage
            garbas={allGarbas}
            onSelectGarba={handleSelectGarba}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddGarba={() => {
              if (!isAuthenticated) {
                openAuthModal('Please sign in with Google to publish your custom Garba!');
                return;
              }
              setIsAddGarbaOpen(true);
            }}
          />
        )}

        {activeTab === 'lyrics' && (
          <LyricsViewer
            garba={selectedGarba || featuredGarba}
            onBack={() => goTo(returnTab)}
            isFavorite={isFavorite((selectedGarba || featuredGarba).id)}
            onToggleFavorite={handleToggleFavorite}
            defaultTab={defaultTab}
          />
        )}

        {activeTab === 'library' && (
          <LibraryPage
            onSelectGarba={handleSelectGarba}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            loadingSongId={loadingSongId}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesPage
            garbas={[...allGarbas, ...extraFavorites]}
            favoriteIds={favorites}
            onSelectGarba={handleSelectGarba}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToGarbas={() => {
              setActiveTab('garbas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Global Search Modal */}
      <SearchBarModal
        garbas={allGarbas}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectGarba={handleSelectGarba}
      />

      {/* Add Custom Garba Modal */}
      <AddGarbaModal
        isOpen={isAddGarbaOpen}
        onClose={() => setIsAddGarbaOpen(false)}
        onAddGarba={handleAddCustomGarba}
      />

      {/* Devotional Google Sign-In Modal Portal */}
      <GoogleAuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

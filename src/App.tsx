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
import { GARBAS_DATA } from './data/garbas';
import type { Garba } from './types';
import { useFavorites } from './hooks/useFavorites';
import { postNeonGarba, fetchNeonGarbas } from './lib/neonClient';

const CUSTOM_GARBAS_STORAGE_KEY = 'navswar_user_custom_garbas_v1';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedGarba, setSelectedGarba] = useState<Garba | null>(null);
  const [defaultTab, setDefaultTab] = useState<'lyrics' | 'audio'>('lyrics');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddGarbaOpen, setIsAddGarbaOpen] = useState(false);

  // Custom User Garbas State
  const [userGarbas, setUserGarbas] = useState<Garba[]>([]);

  const { isAuthenticated, openAuthModal } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Load User Custom Garbas on Mount and sync with Neon PostgreSQL
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_GARBAS_STORAGE_KEY);
      if (saved) {
        setUserGarbas(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load user custom Garbas from local storage:', e);
    }

    // Async sync with Neon PostgreSQL database
    fetchNeonGarbas().then((remoteData) => {
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        const parsedNeon: Garba[] = remoteData.map((item: any) => ({
          id: item.id,
          title: typeof item.title === 'string' ? JSON.parse(item.title) : item.title,
          category: item.category,
          deity: item.deity,
          isFeatured: item.is_featured,
          isPopular: item.is_popular,
          tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags,
          description: typeof item.description === 'string' ? JSON.parse(item.description) : item.description,
          artworkUrl: item.artwork_url,
          lyricsSource: typeof item.lyrics_source === 'string' ? JSON.parse(item.lyrics_source) : item.lyrics_source,
          audioReference: typeof item.audio_reference === 'string' ? JSON.parse(item.audio_reference) : item.audio_reference,
          lyrics: typeof item.lyrics === 'string' ? JSON.parse(item.lyrics) : item.lyrics,
        }));

        setUserGarbas((prev) => {
          const existingIds = new Set([...GARBAS_DATA.map((g) => g.id), ...prev.map((g) => g.id)]);
          const newRemote = parsedNeon.filter((g) => !existingIds.has(g.id));
          return [...newRemote, ...prev];
        });
      }
    }).catch((err) => {
      console.warn('Neon DB fetch failed, using local garba collection fallback:', err);
    });
  }, []);

  const allGarbas = [...GARBAS_DATA, ...userGarbas];
  const featuredGarba = allGarbas.find((g) => g.id === 'amba-abhay-pad-dayini') || allGarbas[0];

  // Auth Gatekeeper Guard: Prevent viewing lyrics or audio unless authenticated
  const handleSelectGarba = (garba: Garba, tab: 'lyrics' | 'audio' = 'lyrics') => {
    if (!isAuthenticated) {
      openAuthModal('Please sign in with Google to view full Garba lyrics and listen to voice references!');
      return;
    }
    setSelectedGarba(garba);
    setDefaultTab(tab);
    setActiveTab('lyrics');
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

  const handleAddCustomGarba = (newGarba: Garba) => {
    const updated = [newGarba, ...userGarbas];
    setUserGarbas(updated);
    localStorage.setItem(CUSTOM_GARBAS_STORAGE_KEY, JSON.stringify(updated));
    postNeonGarba(newGarba).catch((e) => console.error('Failed to post custom Garba to Neon:', e));
    handleSelectGarba(newGarba, 'lyrics');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8ED] text-[#3B1111] antialiased">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if ((tab === 'lyrics' || tab === 'favorites') && !isAuthenticated) {
            openAuthModal(`Please sign in with Google to access ${tab}!`);
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
            onBack={() => {
              setActiveTab('garbas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isFavorite={isFavorite((selectedGarba || featuredGarba).id)}
            onToggleFavorite={handleToggleFavorite}
            defaultTab={defaultTab}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesPage
            garbas={allGarbas}
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

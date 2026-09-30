import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Play } from 'lucide-react';
import type { Garba } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SearchBarModalProps {
  garbas: Garba[];
  isOpen: boolean;
  onClose: () => void;
  onSelectGarba: (garba: Garba, tab?: 'lyrics' | 'audio') => void;
}

export const SearchBarModal: React.FC<SearchBarModalProps> = ({
  garbas,
  isOpen,
  onClose,
  onSelectGarba,
}) => {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredGarbas = query.trim()
    ? garbas.filter((g) => {
        const q = query.toLowerCase();
        return (
          g.title.gu.toLowerCase().includes(q) ||
          g.title.hi.toLowerCase().includes(q) ||
          g.title.en.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.deity.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)) ||
          g.lyrics.gu.some((l) => l.toLowerCase().includes(q))
        );
      })
    : garbas.slice(0, 5); // Show top 5 when empty

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8ED] border-2 border-[#D4AF37] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-[#3B1111] flex flex-col max-h-[80vh]">
        
        {/* Search Bar Header */}
        <div className="p-4 bg-[#3B1111] border-b-2 border-[#D4AF37]/50 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.explore.searchBarPlaceholder}
            className="w-full bg-transparent text-[#FFF8ED] placeholder-[#FFF8ED]/50 text-base outline-none font-gujarati font-medium"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#1A0505] text-[#D4AF37] hover:bg-[#8B0000] hover:text-[#FFF8ED] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="flex items-center justify-between text-xs text-[#8B0000] font-bold uppercase tracking-wider px-2">
            <span>{query ? `Search Results (${filteredGarbas.length})` : 'Popular Garbas'}</span>
            <span className="text-[10px] text-[#3B1111]/60 font-sans">Press ESC to close</span>
          </div>

          {filteredGarbas.length > 0 ? (
            filteredGarbas.map((garba) => {
              const titleText = garba.title[language] || garba.title.gu;
              const secondaryTitle = language === 'en' ? garba.title.gu : garba.title.en;

              return (
                <div
                  key={garba.id}
                  className="bg-[#FFF8ED] p-3.5 rounded-2xl border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#FFF3D6] transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#D4AF37]/50 shrink-0 bg-[#3B1111]">
                      <img src={garba.artworkUrl} alt={garba.title.en} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-bold text-base md:text-lg text-[#3B1111] truncate ${
                        language === 'gu' ? 'font-gujarati' : language === 'hi' ? 'font-hindi' : 'font-serif-heading'
                      }`}>
                        {titleText}
                      </h4>
                      <p className="font-serif-heading text-xs text-[#8B0000] truncate">
                        {secondaryTitle} • <span className="font-sans text-[11px] text-[#3B1111]/70">{garba.category}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onSelectGarba(garba, 'lyrics');
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#8B0000] text-[#FFF8ED] text-xs font-bold hover:bg-[#A00000] transition-colors border border-[#D4AF37]/50"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Lyrics</span>
                    </button>
                    {garba.audioReference && (
                      <button
                        onClick={() => {
                          onSelectGarba(garba, 'audio');
                          onClose();
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#3B1111] text-[#D4AF37] text-xs font-bold hover:bg-[#8B0000] hover:text-[#FFF8ED] transition-colors border border-[#D4AF37]/50"
                        title="Listen to audio reference"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-[#3B1111]/70 font-gujarati">
              <p className="text-base font-bold">{t.explore.noResults}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

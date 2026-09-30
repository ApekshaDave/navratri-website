import React, { useState } from 'react';
import { Search, Heart, Globe, Menu, X, BookOpen, Music, Info, LogIn, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import type { Language } from '../types';

import navswarLogo from '../assets/navswar_logo.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  favoritesCount,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Music },
    { id: 'garbas', label: t.nav.garbas, icon: BookOpen },
    { id: 'favorites', label: t.nav.favorites, icon: Heart, badge: favoritesCount },
    { id: 'about', label: t.nav.about, icon: Info },
  ];

  const languages: { id: Language; label: string }[] = [
    { id: 'gu', label: 'ગુજરાતી' },
    { id: 'hi', label: 'हिंदी' },
    { id: 'en', label: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#6A0000]/95 backdrop-blur-xl border-b border-[#D4AF37]/40 shadow-xl text-[#FFF8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 group text-left focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#D4AF37] shadow-lg group-hover:scale-105 transition-transform bg-[#4A0000] p-0.5">
              <img src={navswarLogo} alt="NavSwar Divine Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="font-serif-title text-2xl font-extrabold text-gold-gradient tracking-wide block leading-tight">
                {t.brandName}
              </span>
              <span className="text-[9px] uppercase font-extrabold text-[#D4AF37] tracking-[0.2em] block opacity-90 mt-0.5">
                SONGS • LYRICS • BHAKTI
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#3B0505]/60 p-1.5 rounded-2xl border border-[#D4AF37]/25 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-[#800000] text-[#FFF8ED] border border-[#D4AF37] shadow-md'
                      : 'text-[#FFF8ED]/80 hover:text-[#FFF8ED] hover:bg-[#800000]/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 bg-[#B71C1C] text-[#FFF8ED] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#D4AF37]/80">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Tools: Language Switcher, Clean Search & Profile/Sign In */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Direct Language Switcher Bar on Homepage (Available Before Sign In) */}
            <div className="flex items-center bg-[#3B0505]/90 border border-[#D4AF37]/40 rounded-xl p-1 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37] ml-1.5 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                    language === lang.id
                      ? 'bg-[#D4AF37] text-[#3B1111] shadow-sm'
                      : 'text-[#FFF8ED]/75 hover:text-[#FFF8ED]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Clean Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B0505]/80 border border-[#D4AF37]/40 text-xs text-[#FFF8ED]/90 hover:text-[#FFF8ED] hover:border-[#D4AF37] transition-all shadow-sm"
              title="Search Garbas"
            >
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-medium max-w-[130px] truncate">{t.nav.searchPlaceholder}</span>
            </button>

            {/* Profile Dropdown or Sign In Button */}
            {!isAuthenticated ? (
              <button
                onClick={() => openAuthModal()}
                className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#3B1111] font-extrabold px-4 py-2 rounded-xl shadow-md hover:brightness-105 text-xs transition-all border border-[#FFF8ED]/50"
              >
                <LogIn className="w-4 h-4 text-[#3B1111]" />
                <span>
                  {language === 'gu' ? 'સાઇન ઇન' : language === 'hi' ? 'साइन इन' : 'Sign In'}
                </span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 bg-[#3B0505]/80 border border-[#D4AF37] p-1.5 pr-3 rounded-xl hover:bg-[#500000] transition-colors shadow-md"
                >
                  <img
                    src={user?.avatarUrl}
                    alt={user?.name}
                    className="w-7 h-7 rounded-lg border border-[#D4AF37] bg-[#500000]"
                  />
                  <span className="text-xs font-bold text-[#FFF8ED] max-w-[110px] truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Profile Settings Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#4A0000] border-2 border-[#D4AF37] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in space-y-2">
                    <div className="px-3 py-2 border-b border-[#D4AF37]/30">
                      <p className="text-xs font-bold text-[#FFF8ED] truncate">{user?.name}</p>
                      <p className="text-[10px] text-[#D4AF37] truncate">{user?.email}</p>
                    </div>

                    {/* Language Selector inside Profile Menu */}
                    <div className="px-3 py-1.5">
                      <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" /> Language / ભાષા
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => {
                              setLanguage(lang.id);
                            }}
                            className={`py-1 rounded-lg text-[11px] font-bold transition-all ${
                              language === lang.id
                                ? 'bg-[#D4AF37] text-[#3B1111] shadow-sm'
                                : 'bg-[#300000] text-[#FFF8ED]/70 hover:text-[#FFF8ED]'
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#D4AF37]/30 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:bg-[#800000] transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl bg-[#3B0505] border border-[#D4AF37]/40 text-[#D4AF37]"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#800000] border border-[#D4AF37] text-[#FFF8ED]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#3A0000] border-b-2 border-[#D4AF37] p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold border ${
                    isActive
                      ? 'bg-[#800000] text-[#FFF8ED] border-[#D4AF37]'
                      : 'bg-[#2A0000] text-[#FFF8ED]/80 border-[#D4AF37]/20'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Profile & Language Settings */}
          <div className="pt-3 border-t border-[#D4AF37]/30 space-y-3">
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#3B1111] font-extrabold py-3 rounded-xl shadow-lg text-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {language === 'gu' ? 'ગૂગલ સાઇન ઇન' : language === 'hi' ? 'गूगल साइन इन' : 'Sign In with Google'}
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between bg-[#2A0000] p-3 rounded-xl border border-[#D4AF37]/40">
                <div className="flex items-center gap-2">
                  <img src={user?.avatarUrl} alt={user?.name} className="w-8 h-8 rounded-lg border border-[#D4AF37]" />
                  <div>
                    <p className="text-xs font-bold text-[#FFF8ED]">{user?.name}</p>
                    <p className="text-[10px] text-[#D4AF37]">{user?.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="p-2 text-red-400 hover:text-red-300">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Mobile Language Selector */}
            <div className="flex items-center justify-between bg-[#2A0000] p-2 rounded-xl border border-[#D4AF37]/30">
              <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 ml-1">
                <Globe className="w-4 h-4" /> Language
              </span>
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      language === lang.id
                        ? 'bg-[#D4AF37] text-[#3B1111]'
                        : 'bg-[#3A0000] text-[#FFF8ED]/70'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

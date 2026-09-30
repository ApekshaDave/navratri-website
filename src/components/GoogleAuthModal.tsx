import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Music, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const GoogleAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, authMessage } = useAuth();
  const { language } = useLanguage();
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = () => {
    loginWithGoogle();
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGoogle(customName || 'Devotee Singer', customEmail || 'devotee@navswar.com');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#700000] via-[#500000] to-[#300000] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#FFF8ED]">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-[#D4AF37] hover:bg-[#800000] transition-colors"
          title="Close sign in dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#800000] to-[#D4AF37] p-0.5 mx-auto shadow-xl ring-4 ring-[#D4AF37]/30">
            <div className="w-full h-full bg-[#500000] rounded-full flex items-center justify-center text-2xl">
              🌺
            </div>
          </div>

          <h3 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#FFF8ED] tracking-wide">
            {language === 'gu'
              ? 'નવસ્વર ભક્તિ સાઇન-ઇન'
              : language === 'hi'
              ? 'नवस्वर भक्ति साइन-इन'
              : 'NavSwar Devotional Portal'}
          </h3>

          <p className="text-xs text-[#D4AF37] font-medium leading-relaxed max-w-xs mx-auto">
            {authMessage ||
              (language === 'gu'
                ? 'સંપૂર્ણ ગરબા સાહિત્ય, ઓડિયો સાંભળવા અને તમારા પોતાના ગરબા ઉમેરવા માટે સાઇન-ઇન કરો.'
                : language === 'hi'
                ? 'पूर्ण गरबा साहित्य, ऑडियो सुनने और अपने खुद के गरबा जोड़ने के लिए साइन-इन करें।'
                : 'Sign in to unlock full Garba lyrics, voice recordings, audio playback & submit custom Garbas!')}
          </p>
        </div>

        {/* Feature Access Highlights */}
        <div className="grid grid-cols-3 gap-2 bg-[#400000] border border-[#D4AF37]/30 p-3 rounded-2xl text-center text-[10px]">
          <div className="space-y-1">
            <BookOpen className="w-4 h-4 text-[#D4AF37] mx-auto" />
            <span className="block font-bold">Full Lyrics</span>
          </div>
          <div className="space-y-1">
            <Music className="w-4 h-4 text-[#D4AF37] mx-auto" />
            <span className="block font-bold">Audio Player</span>
          </div>
          <div className="space-y-1">
            <Sparkles className="w-4 h-4 text-[#D4AF37] mx-auto" />
            <span className="block font-bold">Add Garba</span>
          </div>
        </div>

        {/* Google Sign-In Main Button */}
        {!showEmailForm ? (
          <div className="space-y-3 pt-1">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-bold py-3.5 px-4 rounded-2xl shadow-xl transition-all hover:scale-[1.02] border-2 border-[#D4AF37]"
            >
              {/* Official Google Icon SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-sm font-extrabold tracking-wide">Continue with Google</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="text-xs text-[#D4AF37] hover:underline font-medium"
              >
                Or sign in with Devotee Email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomFormSubmit} className="space-y-3 pt-1">
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Your Devotee Name (e.g. Apeksha Dave)"
              className="w-full bg-[#400000] text-[#FFF8ED] placeholder-[#FFF8ED]/50 px-4 py-2.5 rounded-xl border border-[#D4AF37]/50 text-xs outline-none focus:border-[#D4AF37]"
            />
            <input
              type="email"
              required
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="devotee@navswar.com"
              className="w-full bg-[#400000] text-[#FFF8ED] placeholder-[#FFF8ED]/50 px-4 py-2.5 rounded-xl border border-[#D4AF37]/50 text-xs outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#3B1111] font-extrabold py-3 rounded-xl shadow-lg hover:brightness-110 text-xs"
            >
              Complete Devotional Sign In
            </button>
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="text-xs text-[#FFF8ED]/70 hover:underline"
              >
                ← Back to Google Sign In
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#D4AF37]/80 pt-2 border-t border-[#D4AF37]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure Google OAuth 2.0 Auth • NavSwar Devotional Platform</span>
        </div>

      </div>
    </div>
  );
};

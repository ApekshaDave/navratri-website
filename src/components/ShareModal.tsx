import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import type { Garba } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getGarbaSlug } from '../utils/slug';

interface ShareModalProps {
  garba: Garba;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ garba, onClose }) => {
  const { language, t } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const slug = garba.slug || getGarbaSlug({ id: garba.id, title: garba.title, isBuiltin: garba.isBuiltin });
  const canonicalUrl = `https://garbaraas.in/garba/${slug}`;

  const primaryTitle = garba.title[language] || garba.title.gu || garba.title.en || '';
  const shareText = `🚩 *${primaryTitle}* 🚩\n\n📖 Read full lyrics & listen on Garbaraas:\n${canonicalUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    let success = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(canonicalUrl);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = canonicalUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        success = false;
      }
    }

    const msg = language === 'gu' ? 'લિંક કોપી થઈ ગઈ!' : language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied to clipboard!';
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${primaryTitle} - Garbaraas`,
          text: `Read traditional Gujarati lyrics for "${primaryTitle}" on Garbaraas!`,
          url: canonicalUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('Share error:', err);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8ED] border-2 border-[#D4AF37] rounded-3xl p-6 max-w-md w-full shadow-2xl text-[#3B1111] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#3B1111]/10 text-[#3B1111] hover:bg-[#8B0000] hover:text-[#FFF8ED] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#8B0000]">
            <Share2 className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h3 className="font-serif-heading text-xl font-bold text-[#8B0000]">
            {t.lyricsView.shareGarba}
          </h3>
          <p className="font-gujarati text-lg font-bold text-[#3B1111]">
            {garba.title.gu}
          </p>
          {garba.title.en && (
            <p className="font-serif-heading text-xs text-[#8B0000]/80">
              {garba.title.en}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {/* 1. Primary Action: Direct WhatsApp Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#25D366] text-white font-bold text-sm shadow-md hover:bg-[#20bd5a] hover:scale-[1.01] transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>{language === 'gu' ? 'વોટ્સએપ પર મોકલો' : language === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Send on WhatsApp'}</span>
          </a>

          {/* 2. Secondary Action: Web Share API if supported */}
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#600000] text-[#D4AF37] border border-[#D4AF37]/50 font-bold text-sm shadow-md hover:bg-[#800000] hover:text-[#FFF8ED] transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'gu' ? 'અન્ય ઍપ દ્વારા શેર કરો' : language === 'hi' ? 'अन्य ऐप से शेयर करें' : 'Share via other apps'}</span>
            </button>
          )}

          {/* 3. Secondary Action: Copy Link */}
          <div className="flex items-center gap-2 bg-[#FFF8ED] p-2 rounded-xl border border-[#D4AF37]/50 shadow-inner">
            <input
              type="text"
              readOnly
              value={canonicalUrl}
              className="flex-1 bg-transparent text-xs text-[#3B1111] font-mono px-2 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8B0000] text-[#FFF8ED] text-xs font-bold hover:bg-[#A00000] transition-colors"
            >
              {toastMessage ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{language === 'gu' ? 'કોપી થયું' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'gu' ? 'કોપી' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          {toastMessage && (
            <p className="text-center text-xs font-bold text-[#8B0000] pt-1 animate-in fade-in">
              {toastMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

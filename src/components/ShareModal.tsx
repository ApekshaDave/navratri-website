import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import type { Garba } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ShareModalProps {
  garba: Garba;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ garba, onClose }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${garba.title.gu} - ${garba.title.en}\nRead lyrics on NavSwar: ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NavSwar | ${garba.title.gu}`,
          text: `Read traditional Gujarati lyrics for "${garba.title.gu}" (${garba.title.en}) on NavSwar!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      handleCopy();
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
          <p className="font-gujarati text-base font-bold text-[#3B1111]">
            {garba.title.gu}
          </p>
          <p className="font-serif-heading text-xs text-[#8B0000]/80">
            {garba.title.en}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-[#FFF8ED] p-2 rounded-xl border border-[#D4AF37]/50 shadow-inner">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-[#3B1111] font-mono px-2 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8B0000] text-[#FFF8ED] text-xs font-bold hover:bg-[#A00000] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {'share' in navigator && (
            <button
              onClick={handleWebShare}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#3B1111] font-bold text-sm shadow-md hover:scale-[1.02] transition-transform"
            >
              <Share2 className="w-4 h-4 text-[#3B1111]" />
              <span>Share via App</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

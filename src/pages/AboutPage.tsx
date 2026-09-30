import React from 'react';
import { BookmarkCheck, Shield, Globe, Music } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import navswarLogo from '../assets/navswar_logo.png';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-[#800000] min-h-screen text-[#FFF8ED] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <h1 className="font-serif-title text-4xl sm:text-5xl font-extrabold text-[#FFF8ED] text-gold-gradient">
            {t.brandName} - {t.tagline}
          </h1>
        </div>

        {/* Main Mission Card - Pure Red */}
        <div className="bg-[#6A0000] border-4 border-[#D4AF37] rounded-3xl p-8 md:p-12 shadow-2xl space-y-6 text-[#FFF8ED] relative overflow-hidden">
          
          <div className="flex items-center gap-4 pb-6 border-b-2 border-[#D4AF37]/30">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-lg bg-[#400000] p-0.5 shrink-0">
              <img src={navswarLogo} alt="NavSwar Emblem" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <h2 className="font-serif-heading text-2xl font-bold text-[#D4AF37]">
                {t.about.subtitle}
              </h2>
              <p className="font-gujarati text-sm text-[#FFF8ED]/80 mt-0.5">
                {t.about.missionTitle}
              </p>
            </div>
          </div>

          <div className="space-y-4 font-sans text-base md:text-lg leading-relaxed text-[#FFF8ED]/95">
            <p>
              {t.about.missionText}
            </p>
            <p>
              {t.about.audioPurposeText}
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-[#500000] p-5 rounded-2xl border border-[#D4AF37]/50 text-center space-y-2">
              <Music className="w-7 h-7 text-[#D4AF37] mx-auto" />
              <h4 className="font-serif-heading text-sm font-bold text-[#D4AF37]">
                {t.about.audioPurposeTitle}
              </h4>
              <p className="text-xs text-[#FFF8ED]/80 leading-relaxed font-sans">
                {language === 'gu'
                  ? 'ઓડિયો રેફરન્સ રેકોર્ડ અને લાઈક્સ સિસ્ટમ'
                  : language === 'hi'
                  ? 'ऑडियो संदर्भ रिकॉर्ड और लाइक सिस्टम'
                  : 'Voice reference recording & upvoted audio comments'}
              </p>
            </div>

            <div className="bg-[#500000] p-5 rounded-2xl border border-[#D4AF37]/50 text-center space-y-2">
              <Globe className="w-7 h-7 text-[#D4AF37] mx-auto" />
              <h4 className="font-serif-heading text-sm font-bold text-[#D4AF37]">
                {language === 'gu' ? 'બહુભાષી સાહિત્ય' : language === 'hi' ? 'बहुभाषी साहित्य' : 'Multilingual Lyrics'}
              </h4>
              <p className="text-xs text-[#FFF8ED]/80 leading-relaxed font-sans">
                {language === 'gu'
                  ? 'ગુજરાતી, હિન્દી અને અંગ્રેજી ભાષા સપોર્ટ'
                  : language === 'hi'
                  ? 'गुजराती, हिंदी और अंग्रेजी भाषा सपोर्ट'
                  : 'Full support for Gujarati, Hindi & English'}
              </p>
            </div>

            <div className="bg-[#500000] p-5 rounded-2xl border border-[#D4AF37]/50 text-center space-y-2">
              <Shield className="w-7 h-7 text-[#D4AF37] mx-auto" />
              <h4 className="font-serif-heading text-sm font-bold text-[#D4AF37]">
                {t.about.communityTitle}
              </h4>
              <p className="text-xs text-[#FFF8ED]/80 leading-relaxed font-sans">
                {t.about.communityText}
              </p>
            </div>
          </div>

          {/* Cultural Heritage Card */}
          <div className="bg-[#400000] text-[#FFF8ED] p-6 rounded-2xl border-2 border-[#D4AF37] space-y-3 mt-6">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-sm uppercase tracking-wider">
              <BookmarkCheck className="w-5 h-5" />
              <span>{t.attribution.sourceLabel}</span>
            </div>
            <p className="text-xs md:text-sm text-[#FFF8ED]/90 font-sans leading-relaxed">
              {t.footer.brandText}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

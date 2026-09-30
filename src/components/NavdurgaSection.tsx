import React, { useState } from 'react';
import { Sparkles, Maximize2, X } from 'lucide-react';
import { NAVDURGA_DATA } from '../data/navdurga';
import { useLanguage } from '../context/LanguageContext';

export const NavdurgaSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedForm, setSelectedForm] = useState(NAVDURGA_DATA[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#800000] via-[#600000] to-[#800000] border-y-4 border-[#D4AF37] text-[#FFF8ED] relative overflow-hidden">
      {/* Background Decorative Mandala Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37] px-4 py-1.5 rounded-full mb-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              {t.navdurga.sectionTitle}
            </span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient tracking-tight">
            {language === 'gu' ? 'નવદુર્ગા ૯ સ્વરૂપ પાવન દર્શન' : language === 'hi' ? 'नवदुर्गा ९ स्वरूप पावन दर्शन' : 'Navdurga 9 Sacred Forms'}
          </h2>
          <p className="text-base md:text-lg text-[#FFF8ED]/95 font-gujarati mt-3 leading-relaxed font-bold">
            {t.navdurga.subtitle}
          </p>
        </div>

        {/* Main Navdurga Grid & Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 9 Nights Buttons Selector Grid */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-3">
            {NAVDURGA_DATA.map((form) => {
              const isSelected = selectedForm.id === form.id;
              return (
                <button
                  key={form.id}
                  onClick={() => setSelectedForm(form)}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 relative overflow-hidden group focus:outline-none ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#B71C1C] to-[#800000] border-[#D4AF37] border-2 shadow-xl scale-[1.03]'
                      : 'bg-[#600000]/80 border-[#D4AF37]/30 hover:border-[#D4AF37]/70 hover:bg-[#800000]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#3B1111] text-[#D4AF37] px-2 py-0.5 rounded-md border border-[#D4AF37]/40">
                      Night {form.night}
                    </span>
                    <span className="text-sm">🪔</span>
                  </div>

                  <div>
                    <h3 className="font-gujarati text-base md:text-lg font-bold text-[#FFF8ED] leading-tight group-hover:text-[#D4AF37] transition-colors">
                      {form.name[language] || form.name.gu}
                    </h3>
                    <p className="text-[10px] font-serif-heading text-[#D4AF37] font-medium">
                      {form.name.en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Goddess Showcase Frame - Clickable to Zoom */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1A0505] to-[#3B1111] rounded-3xl border-2 border-[#D4AF37] p-6 shadow-2xl relative">
            <div
              onClick={() => setIsZoomed(true)}
              className="relative h-72 rounded-2xl overflow-hidden border border-[#D4AF37]/50 mb-6 cursor-pointer group shadow-lg"
              title="Click to view full enlarged image"
            >
              <img
                src={selectedForm.image}
                alt={selectedForm.name.en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0505] via-transparent to-transparent opacity-80"></div>
              
              {/* Expand Hint Overlay Badge */}
              <div className="absolute top-3 right-3 bg-[#1A0505]/90 border border-[#D4AF37] text-[#D4AF37] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md group-hover:bg-[#D4AF37] group-hover:text-[#1A0505] transition-all">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Zoom Image</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-mono text-[#D4AF37] bg-[#3B1111]/90 px-3 py-1 rounded-full border border-[#D4AF37]/50 inline-block mb-1">
                  નવરાત્રી નોરતું {selectedForm.night}
                </span>
                <h3 className="font-gujarati text-2xl md:text-3xl font-extrabold text-[#FFF8ED]">
                  મા {selectedForm.name.gu}
                </h3>
              </div>
            </div>

            {/* Mantra & Color Info */}
            <div className="space-y-4">
              <div className="bg-[#3B1111]/80 border-l-4 border-[#D4AF37] p-3.5 rounded-r-xl border-y border-r border-[#D4AF37]/30">
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-0.5">
                  {t.navdurga.mantraHeader}
                </span>
                <p className="font-hindi text-base md:text-lg font-bold text-[#FFF8ED]">
                  {selectedForm.mantra}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs bg-[#1A0505] p-3 rounded-xl border border-[#D4AF37]/30">
                <span className="text-[#FFF8ED]/70 font-sans">{t.navdurga.colorHeader}:</span>
                <span className="font-bold text-[#D4AF37] flex items-center gap-1.5 font-sans">
                  <span
                    className="w-3 h-3 rounded-full border border-[#FFF8ED]"
                    style={{ backgroundColor: selectedForm.colorHex }}
                  ></span>
                  {selectedForm.color}
                </span>
              </div>

              <p className="text-xs md:text-sm text-[#FFF8ED]/90 font-gujarati leading-relaxed">
                {selectedForm.description[language] || selectedForm.description.gu}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Expanded Lightbox Modal for 9 Durga Form Image */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-[#1A0505]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-[#600000] border-4 border-[#D4AF37] rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 flex flex-col items-center space-y-4">
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-[#8B0000] border-2 border-[#D4AF37] text-[#FFF8ED] p-2 rounded-full hover:bg-[#D4AF37] hover:text-[#3B1111] transition-all z-20 shadow-xl"
              title="Close image"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Enlarged High-Res Image - Full Cover with Zero Blank Spaces */}
            <div className="w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-[#1A0505] relative">
              <img
                src={selectedForm.image}
                alt={selectedForm.name.en}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0505] via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>

            {/* Modal Caption */}
            <div className="text-center space-y-2">
              <div className="inline-block bg-[#D4AF37] text-[#3B1111] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Night {selectedForm.night} - મા {selectedForm.name.gu} ({selectedForm.name.en})
              </div>
              <p className="font-hindi text-lg font-bold text-[#FFF8ED]">
                {selectedForm.mantra}
              </p>
              <p className="text-xs md:text-sm text-[#FFF8ED]/90 font-sans max-w-2xl mx-auto">
                {selectedForm.description[language] || selectedForm.description.gu}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

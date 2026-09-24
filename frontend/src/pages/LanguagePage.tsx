import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Check, Sparkles } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/translationService.js';
import { useVisitor } from '../contexts/VisitorContext.js';

export const LanguagePage: React.FC = () => {
  const { language, setLanguage } = useVisitor();
  const navigate = useNavigate();

  const handleSelectLanguage = (code: any) => {
    setLanguage(code);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-museum-gold/10 border border-museum-gold/30 text-museum-gold text-xs font-semibold mb-3">
          <Globe size={13} />
          <span>Multilingual Localization Engine</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Select Preferred Language</h1>
        <p className="text-sm text-museum-muted">
          All curatorial narratives, audio guide voice commentary, and AI Art Expert responses adapt dynamically to your selected language.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {SUPPORTED_LANGUAGES.map(lang => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-museum-gold/15 border-museum-gold shadow-gold-glow/40 scale-[1.02]'
                  : 'bg-[#15181D] border-museum-border/70 hover:border-museum-gold/40 hover:bg-[#1A1E24]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{lang.flag}</span>
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-museum-gold text-black flex items-center justify-center">
                    <Check size={14} />
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-0.5">{lang.nativeName}</h3>
                <p className="text-xs text-museum-muted font-sans">{lang.name}</p>
                <span className="text-[10px] font-mono text-museum-gold mt-2 block uppercase">
                  {lang.code} Localization
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

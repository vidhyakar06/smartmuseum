import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Compass, Map, Sparkles, Globe, Shield, QrCode } from 'lucide-react';
import { useVisitor } from '../contexts/VisitorContext.js';
import { SUPPORTED_LANGUAGES } from '../services/translationService.js';
import { BeaconBar } from '../components/BeaconBar.js';
import { AudioPlayer } from '../components/AudioPlayer.js';
import { AIChatbotWidget } from '../components/AIChatbotWidget.js';

export const VisitorLayout: React.FC = () => {
  const { language, setLanguage, t } = useVisitor();
  const [isLangOpen, setIsLangOpen] = React.useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F8FAFC] flex flex-col pb-20 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0E1116]/95 backdrop-blur-md border-b border-museum-border/70">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Museum Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center text-black font-bold text-lg shadow-gold-glow/40 transition-transform group-hover:scale-105">
              🏛️
            </div>
            <div>
              <span className="font-serif font-bold text-lg tracking-wide text-white group-hover:text-museum-gold transition-colors">
                Smart Museum
              </span>
              <span className="block text-[10px] text-museum-gold uppercase tracking-widest font-mono">
                Interactive Art Guide
              </span>
            </div>
          </Link>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  isLangOpen
                    ? 'bg-museum-gold/20 border-museum-gold text-museum-gold shadow-gold-glow/30'
                    : 'bg-museum-elevated hover:bg-museum-border border-museum-border text-museum-text'
                }`}
                aria-label="Switch Language"
              >
                <span className="text-base">{currentLangObj.flag}</span>
                <span className="font-medium">{currentLangObj.nativeName}</span>
                <Globe size={13} className="text-museum-gold ml-0.5" />
              </button>

              {/* Backdrop dismissal */}
              {isLangOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangOpen(false)}
                />
              )}

              {/* Language Dropdown Menu */}
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#15181D] border border-museum-gold/40 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-museum-gold border-b border-museum-border/50 flex items-center justify-between">
                    <span>9 Supported Languages</span>
                    <Link
                      to="/languages"
                      onClick={() => setIsLangOpen(false)}
                      className="text-[10px] text-museum-cyan hover:underline lowercase"
                    >
                      view all
                    </Link>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between hover:bg-museum-elevated transition-colors ${
                          language === lang.code ? 'text-museum-gold font-bold bg-museum-gold/15' : 'text-museum-text'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        <span className="text-[10px] text-museum-muted font-mono">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'text-museum-gold bg-museum-gold/10' : 'text-museum-muted hover:text-white'
                  }`
                }
              >
                {t('navHome')}
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'text-museum-gold bg-museum-gold/10' : 'text-museum-muted hover:text-white'
                  }`
                }
              >
                {t('navExplore')}
              </NavLink>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'text-museum-gold bg-museum-gold/10' : 'text-museum-muted hover:text-white'
                  }`
                }
              >
                {t('navMap')}
              </NavLink>
              <NavLink
                to="/scan"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive ? 'text-museum-gold bg-museum-gold/10 font-bold' : 'text-museum-muted hover:text-white'
                  }`
                }
              >
                <QrCode size={13} />
                <span>Scan QR</span>
              </NavLink>
              <NavLink
                to="/ai"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive ? 'text-museum-cyan bg-museum-cyan/10 font-bold' : 'text-museum-cyan/80 hover:text-museum-cyan'
                  }`
                }
              >
                <Sparkles size={13} />
                <span>{t('navAI')}</span>
              </NavLink>
              <NavLink
                to="/languages"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    isActive ? 'text-museum-gold bg-museum-gold/10 font-bold' : 'text-museum-muted hover:text-white'
                  }`
                }
              >
                <Globe size={13} />
                <span>{t('navLanguages')}</span>
              </NavLink>
            </nav>

            {/* Admin Portal Button */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-museum-elevated hover:bg-museum-border border border-museum-border text-xs text-museum-muted hover:text-white transition-colors"
              title="Museum Staff / Admin Portal"
            >
              <Shield size={13} className="text-museum-gold" />
              <span className="hidden sm:inline font-mono">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Simulated Beacon Bar */}
      <BeaconBar />

      {/* Main Page Route Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Persistent Audio Guide Player */}
      <AudioPlayer />

      {/* Floating AI Chatbot Assistant */}
      <AIChatbotWidget />

      {/* Mobile-First Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E1116]/95 backdrop-blur-xl border-t border-museum-border/70 py-2 px-2 flex items-center justify-around">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-museum-gold' : 'text-museum-muted hover:text-white'
            }`
          }
        >
          <Home size={18} />
          <span>{t('navHome')}</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-museum-gold' : 'text-museum-muted hover:text-white'
            }`
          }
        >
          <Compass size={18} />
          <span>{t('navExplore')}</span>
        </NavLink>

        {/* Highlighted Center AI Guide Button */}
        <NavLink
          to="/ai"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-museum-cyan to-blue-500 text-black shadow-lg shadow-museum-cyan/30 border-2 border-[#0B0D10] font-bold transition-transform active:scale-95 ${
              isActive ? 'ring-2 ring-museum-cyan' : ''
            }`
          }
        >
          <Sparkles size={20} className="text-black" />
        </NavLink>

        <NavLink
          to="/scan"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-museum-gold' : 'text-museum-muted hover:text-white'
            }`
          }
        >
          <QrCode size={18} />
          <span>Scan QR</span>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-museum-gold' : 'text-museum-muted hover:text-white'
            }`
          }
        >
          <Map size={18} />
          <span>{t('navMap')}</span>
        </NavLink>

        <NavLink
          to="/languages"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-museum-gold font-bold' : 'text-museum-muted hover:text-white'
            }`
          }
        >
          <Globe size={18} />
          <span>{t('navLanguages')}</span>
        </NavLink>
      </nav>
    </div>
  );
};

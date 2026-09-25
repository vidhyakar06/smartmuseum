import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Map,
  Sparkles,
  Users,
  Clock,
  Layers,
  ArrowRight,
  Headphones,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Globe,
  Check
} from 'lucide-react';
import { useVisitor } from '../contexts/VisitorContext.js';
import { api } from '../services/api.js';
import { Exhibit, Gallery } from '../types/index.js';
import { ExhibitCard } from '../components/ExhibitCard.js';
import { SUPPORTED_LANGUAGES } from '../services/translationService.js';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage } = useVisitor();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getExhibits({ highlight: true }),
      api.getGalleries()
    ]).then(([exRes, galRes]) => {
      if (exRes.success) setExhibits(exRes.data);
      if (galRes.success) setGalleries(galRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const totalVisitorsNow = galleries.reduce((acc, g) => acc + g.currentOccupancy, 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-museum-border/70 bg-gradient-to-b from-[#151921] via-[#0E1116] to-[#0B0D10] p-6 sm:p-10 lg:p-14 shadow-2xl">
        {/* Ambient Decorative Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-museum-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-museum-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-museum-gold/10 border border-museum-gold/30 text-museum-gold text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-museum-gold animate-pulse" />
            <span>{t('byodPortal')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] mb-4">
            {t('welcomeTitle')}
          </h1>

          <p className="text-lg sm:text-xl text-museum-muted font-sans font-light tracking-wide mb-8">
            {t('welcomeSubtitle')}
          </p>

          {/* 3 Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
            <Link
              to="/explore"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-museum-gold text-black font-bold shadow-lg shadow-museum-gold/25 hover:scale-[1.02] active:scale-95 transition-all text-center group"
            >
              <Compass size={24} className="mb-2 group-hover:rotate-12 transition-transform" />
              <span className="text-xs sm:text-sm">{t('startExploring')}</span>
            </Link>

            <Link
              to="/map"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1E232B] hover:bg-[#252C36] text-white border border-museum-border hover:border-museum-cyan/60 shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center group"
            >
              <Map size={24} className="mb-2 text-museum-cyan group-hover:-translate-y-1 transition-transform" />
              <span className="text-xs sm:text-sm">{t('exploreMap')}</span>
            </Link>

            <Link
              to="/ai"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-tr from-[#1E232B] to-[#202E3D] hover:to-[#283A4E] text-museum-cyan border border-museum-cyan/40 shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center group"
            >
              <Sparkles size={24} className="mb-2 group-hover:rotate-12 transition-transform text-museum-cyan" />
              <span className="text-xs sm:text-sm font-semibold">{t('askAIGuide')}</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-museum-border/60 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-museum-gold">
                <Users size={16} />
              </div>
              <div>
                <p className="text-white font-bold">{totalVisitorsNow} {t('visitorsCount')}</p>
                <p className="text-museum-muted text-[11px]">{t('currentVisitors')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-museum-cyan">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-white font-bold">9:00 AM – 7:00 PM</p>
                <p className="text-museum-muted text-[11px]">{t('openingHours').split(':')[0]}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-museum-gold">
                <Layers size={16} />
              </div>
              <div>
                <p className="text-white font-bold">{t('thematicGalleries')}</p>
                <p className="text-museum-muted text-[11px]">{t('galleriesCount')}</p>
              </div>
            </div>

            <Link
              to="/languages"
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-museum-gold/20 flex items-center justify-center text-emerald-400 group-hover:text-museum-gold transition-colors">
                <Globe size={16} />
              </div>
              <div>
                <p className="text-white font-bold group-hover:text-museum-gold transition-colors">9 {t('navLanguages')} ➔</p>
                <p className="text-museum-muted text-[11px]">{t('instantAudioText')}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Multilingual Localization Showcase Bar */}
      <section className="bg-[#12151B] border border-museum-gold/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-museum-gold/20 border border-museum-gold/40 flex items-center justify-center text-museum-gold">
              <Globe size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                  {t('languagesBannerTitle')}
                </h2>
                <span className="text-[10px] font-mono uppercase bg-museum-gold/20 text-museum-gold px-2 py-0.5 rounded-full border border-museum-gold/40">
                  9 Live
                </span>
              </div>
              <p className="text-xs text-museum-muted">
                {t('languagesBannerSub')}
              </p>
            </div>
          </div>

          <Link
            to="/languages"
            className="self-start sm:self-auto text-xs text-museum-gold hover:text-museum-gold-light font-medium inline-flex items-center gap-1 group"
          >
            <span>{t('customLanguageSetup')}</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 9 Quick Switch Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isCurrent = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-museum-gold text-black font-bold border-museum-gold shadow-md shadow-museum-gold/30 scale-105'
                    : 'bg-[#171B22] border-museum-border/70 hover:border-museum-gold/40 hover:bg-[#1E232B] text-museum-text'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-xs truncate w-full">{lang.nativeName}</span>
                <span className={`text-[9px] font-mono ${isCurrent ? 'text-black/80' : 'text-museum-muted'}`}>
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Five Innovations Comparison Matrix */}
      <section className="bg-[#12151B] border border-museum-border/70 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">{t('diffArchitecture')}</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {t('diffHeading')}
            </h2>
          </div>
          <span className="text-xs text-museum-muted mt-2 md:mt-0 font-mono">
            {t('diffSubheading')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              title: t('diff1Title'),
              trad: t('diff1Trad'),
              prop: t('diff1Prop'),
              badge: t('diff1Badge')
            },
            {
              title: t('diff2Title'),
              trad: t('diff2Trad'),
              prop: t('diff2Prop'),
              badge: t('diff2Badge')
            },
            {
              title: t('diff3Title'),
              trad: t('diff3Trad'),
              prop: t('diff3Prop'),
              badge: t('diff3Badge')
            },
            {
              title: t('diff4Title'),
              trad: t('diff4Trad'),
              prop: t('diff4Prop'),
              badge: t('diff4Badge')
            },
            {
              title: t('diff5Title'),
              trad: t('diff5Trad'),
              prop: t('diff5Prop'),
              badge: t('diff5Badge')
            }
          ].map((diff, i) => (
            <div key={i} className="bg-[#171B22] border border-museum-border/60 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{diff.title}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-museum-gold/10 text-museum-gold border border-museum-gold/30">
                    {diff.badge}
                  </span>
                </div>
                <div className="text-[11px] text-red-400/80 mb-2 line-through">
                  {diff.trad}
                </div>
                <div className="text-xs text-museum-text font-medium flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{diff.prop}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Masterpieces Carousel / Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">{t('featuredExhibits')}</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {t('curatedMasterpieces')}
            </h2>
          </div>

          <Link
            to="/explore"
            className="flex items-center gap-1.5 text-xs text-museum-gold hover:text-museum-gold-light font-medium transition-colors"
          >
            <span>{t('viewAllWorks')}</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] bg-museum-elevated rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibits.slice(0, 6).map(exhibit => (
              <ExhibitCard key={exhibit.exhibitId} exhibit={exhibit} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

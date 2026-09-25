import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Headphones,
  Sparkles,
  Navigation,
  Heart,
  Share2,
  Calendar,
  Layers,
  MapPin,
  ChevronLeft,
  Check,
  Clock,
  Info,
  ExternalLink,
  Globe,
  Maximize2,
  X,
  Play,
  Pause
} from 'lucide-react';
import { api } from '../services/api.js';
import { Exhibit } from '../types/index.js';
import { useVisitor } from '../contexts/VisitorContext.js';
import { translationService, SUPPORTED_LANGUAGES } from '../services/translationService.js';
import { ExhibitCard } from '../components/ExhibitCard.js';

export const ExhibitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, setLanguage, favorites, toggleFavorite, playAudio, toggleAudio, activeAudio, t, markVisited } = useVisitor();

  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [relatedExhibits, setRelatedExhibits] = useState<Exhibit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSelectedImageIndex(0);

    const startTime = Date.now();

    api.getExhibit(id)
      .then(res => {
        if (res.success && res.data) {
          setExhibit(res.data);
          markVisited(res.data.exhibitId);

          // Fetch related exhibits in the same gallery
          api.getExhibits({ galleryId: res.data.galleryId })
            .then(relRes => {
              if (relRes.success) {
                setRelatedExhibits(
                  relRes.data.filter(e => e.exhibitId !== res.data.exhibitId).slice(0, 3)
                );
              }
            }).catch(() => {});
        } else {
          setError('Exhibit not found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load exhibit details');
        setLoading(false);
      });

    // Track dwell time on unmount
    return () => {
      const dwellSeconds = Math.round((Date.now() - startTime) / 1000);
      if (dwellSeconds > 3 && id) {
        api.track('exhibit-view', id, undefined, { dwellSeconds });
      }
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-museum-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-museum-muted text-sm">Loading artwork details...</p>
      </div>
    );
  }

  if (error || !exhibit) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Artwork Not Found</h2>
        <p className="text-museum-muted text-sm">{error || 'The requested exhibit could not be located in our digital archive.'}</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-6 py-2.5 bg-museum-gold text-black font-semibold rounded-xl text-xs"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(exhibit.exhibitId);
  const localized = translationService.getExhibitTranslation(exhibit, language);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: exhibit.title,
          text: `Explore "${exhibit.title}" by ${exhibit.artist} on Smart Museum Guide`,
          url: shareUrl
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAskAI = () => {
    navigate(`/ai?exhibitId=${exhibit.exhibitId}`);
  };

  const handleNavigate = () => {
    navigate(`/map?target=${exhibit.exhibitId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 pb-12">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-museum-muted hover:text-white px-3 py-1.5 rounded-lg bg-museum-elevated border border-museum-border transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(exhibit.exhibitId)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
              isFav
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-museum-elevated text-museum-muted hover:text-white border-museum-border'
            }`}
            title="Favorite"
          >
            <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{isFav ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-museum-elevated text-museum-muted hover:text-white border border-museum-border transition-colors flex items-center gap-1.5 text-xs"
            title="Share Artwork"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Artwork Feature Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: High-Res Artwork Visuals (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* High-Res Artwork Visuals Container */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="relative rounded-3xl overflow-hidden bg-[#090B0E] border border-museum-border shadow-2xl group min-h-[440px] max-h-[580px] flex items-center justify-center p-3 cursor-zoom-in"
          >
            {/* Ambient Blurred Artwork Glow */}
            <img
              src={exhibit.images[selectedImageIndex] || exhibit.images[0]}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
            />

            {/* Complete, Uncropped Masterpiece Artwork */}
            <img
              src={exhibit.images[selectedImageIndex] || exhibit.images[0]}
              alt={localized.title}
              className="relative z-10 max-h-[520px] w-auto max-w-full rounded-2xl object-contain shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />

            {/* Gallery Location Overlay */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-museum-cyan/40 text-xs font-mono text-museum-cyan flex items-center gap-1.5 shadow-lg">
                <MapPin size={13} />
                <span>{exhibit.location}</span>
              </span>
            </div>

            {/* Zoom / Expand Indicator */}
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs text-white/90 flex items-center gap-1.5 shadow-lg">
                <Maximize2 size={13} />
                <span>Full View</span>
              </span>
            </div>

            {/* Category Overlay */}
            <div className="absolute bottom-4 left-4 z-20">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-museum-gold/40 text-xs font-semibold text-museum-gold shadow-lg">
                {localized.category || exhibit.category}
              </span>
            </div>
          </div>

          {/* Multiple Image Thumbnails if available */}
          {exhibit.images.length > 1 && (
            <div className="flex items-center gap-2">
              {exhibit.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-museum-gold scale-105' : 'border-museum-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Technical Specs Box */}
          <div className="p-4 rounded-2xl bg-[#15181D] border border-museum-border text-xs space-y-2">
            <div className="flex justify-between border-b border-museum-border/40 pb-1.5">
              <span className="text-museum-muted">Medium</span>
              <span className="text-white font-medium">{exhibit.medium || 'Oil on canvas'}</span>
            </div>
            <div className="flex justify-between border-b border-museum-border/40 pb-1.5">
              <span className="text-museum-muted">Dimensions</span>
              <span className="text-white font-mono">{exhibit.dimensions || 'Standard display'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-museum-muted">Accession ID</span>
              <span className="text-museum-gold font-mono">{exhibit.exhibitId}</span>
            </div>
          </div>
        </div>

        {/* Right: Curatorial Information & Primary Interactive Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-museum-gold text-xs font-mono mb-2">
              <Calendar size={13} />
              <span>Created {exhibit.year}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2 leading-tight">
              {localized.title}
            </h1>

            <h2 className="text-lg text-museum-muted font-sans font-medium mb-6">
              by <strong className="text-white">{exhibit.artist}</strong>
            </h2>
          </div>

          {/* Core Action Command Bar (Ask AI, Listen, Navigate) */}
          <div className="grid grid-cols-3 gap-2.5 p-2 rounded-2xl bg-[#15181D] border border-museum-border">
            {/* Ask AI Button */}
            <button
              onClick={handleAskAI}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-museum-cyan/10 hover:bg-museum-cyan/20 border border-museum-cyan/30 text-museum-cyan hover:scale-[1.02] active:scale-95 transition-all text-center group"
            >
              <Sparkles size={20} className="mb-1 text-museum-cyan group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-bold">{t('askAI')}</span>
            </button>

            {/* Listen Audio Guide Button */}
            <button
              onClick={() => toggleAudio(exhibit)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border hover:scale-[1.02] active:scale-95 transition-all text-center group ${
                activeAudio?.exhibit?.exhibitId === exhibit.exhibitId && activeAudio.isPlaying
                  ? 'bg-museum-gold text-black font-bold border-museum-gold shadow-lg shadow-museum-gold/30'
                  : 'bg-museum-gold/15 hover:bg-museum-gold/25 border-museum-gold/40 text-museum-gold'
              }`}
            >
              <Headphones size={20} className={`mb-1 ${activeAudio?.exhibit?.exhibitId === exhibit.exhibitId && activeAudio.isPlaying ? 'animate-bounce text-black' : 'text-museum-gold group-hover:scale-110'} transition-transform`} />
              <span className="text-xs font-bold">
                {activeAudio?.exhibit?.exhibitId === exhibit.exhibitId && activeAudio.isPlaying ? 'Listening...' : t('listen')}
              </span>
            </button>

            {/* Navigate on Map Button */}
            <button
              onClick={handleNavigate}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-museum-elevated hover:bg-white/10 border border-museum-border text-white hover:scale-[1.02] active:scale-95 transition-all text-center group"
            >
              <Navigation size={20} className="mb-1 text-museum-text group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-xs font-bold">{t('navigate')}</span>
            </button>
          </div>

          {/* Curated In-Depth Painting Audio Tour Showcase */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-museum-gold/15 via-[#161922] to-museum-cyan/10 border border-museum-gold/40 relative overflow-hidden group shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-museum-gold uppercase tracking-wider bg-museum-gold/20 px-2.5 py-0.5 rounded-full border border-museum-gold/40">
                    <Headphones size={12} className={activeAudio?.exhibit?.exhibitId === exhibit.exhibitId && activeAudio.isPlaying ? 'animate-bounce' : ''} />
                    <span>Curated Audio Docent</span>
                  </span>
                  <span className="text-[11px] text-museum-cyan font-mono bg-museum-cyan/10 px-2 py-0.5 rounded border border-museum-cyan/30">
                    {exhibit.audioDuration || 140}s In-Depth Tour
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {activeAudio?.exhibit?.exhibitId === exhibit.exhibitId && activeAudio.isPlaying
                    ? 'Now Explaining Painting In Detail...'
                    : 'Listen to Full Painting Analysis'}
                </h3>
                <p className="text-xs text-museum-muted leading-relaxed">
                  Explains brushwork, medium ({exhibit.medium || 'Oil on canvas'}), dimensions, historical significance, and hidden curatorial insights in {language.toUpperCase()}.
                </p>
              </div>

              <button
                onClick={() => toggleAudio(exhibit)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-museum-gold to-museum-gold-light text-black font-bold text-xs shadow-lg shadow-museum-gold/30 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
              >
                {activeAudio?.exhibit?.exhibitId === exhibit.exhibitId && activeAudio.isPlaying ? (
                  <>
                    <Pause size={15} fill="black" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play size={15} fill="black" />
                    <span>Play Audio Guide</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Multilingual Audio & Curatorial Text Selector */}
          <div className="p-3.5 rounded-2xl bg-[#12151B] border border-museum-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-museum-gold flex items-center gap-1.5 uppercase tracking-wider">
                <Globe size={13} />
                <span>Audio & Description Language (9 Live)</span>
              </span>
              <span className="text-[10px] text-museum-cyan font-mono bg-museum-cyan/10 px-2 py-0.5 rounded border border-museum-cyan/30">
                {language.toUpperCase()} Active
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-museum-gold text-black font-bold shadow-md shadow-museum-gold/30 scale-[1.02]'
                        : 'bg-museum-elevated hover:bg-museum-border text-museum-text border border-museum-border/70 hover:border-museum-gold/40'
                    }`}
                  >
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curatorial Overview Essay */}
          <div className="space-y-4 text-sm leading-relaxed text-museum-text/90">
            <h3 className="text-xs font-semibold text-museum-gold uppercase tracking-wider">
              Curatorial Overview
            </h3>
            <p className="text-base text-white/95 font-serif leading-relaxed">
              {localized.description}
            </p>

            {exhibit.longDescription && (
              <p className="text-xs text-museum-muted leading-relaxed pt-2">
                {exhibit.longDescription}
              </p>
            )}

            {exhibit.curatorNotes && (
              <div className="p-3.5 rounded-xl bg-museum-elevated/80 border-l-2 border-museum-gold text-xs text-museum-muted">
                <span className="font-semibold text-white block mb-1">Chief Curator's Note</span>
                {exhibit.curatorNotes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Works in this Gallery */}
      {relatedExhibits.length > 0 && (
        <section className="pt-8 border-t border-museum-border/70">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">{t('relatedWorks')}</span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                Also in {exhibit.location.split(' - ')[0]}
              </h3>
            </div>
            <Link
              to={`/map?target=${exhibit.exhibitId}`}
              className="text-xs text-museum-cyan hover:underline flex items-center gap-1"
            >
              <span>View Gallery on Floorplan</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedExhibits.map(rel => (
              <ExhibitCard key={rel.exhibitId} exhibit={rel} compact />
            ))}
          </div>
        </section>
      )}

      {/* High-Resolution Zoom Lightbox Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
            title="Close Full View"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[88vh] flex flex-col items-center">
            <img
              src={exhibit.images[selectedImageIndex] || exhibit.images[0]}
              alt={localized.title}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-3 text-center text-sm font-serif text-museum-gold font-medium">
              {localized.title} — {exhibit.artist} ({exhibit.year})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

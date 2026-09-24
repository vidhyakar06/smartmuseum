import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Headphones, Sparkles, Navigation, Heart, ChevronRight } from 'lucide-react';
import { Exhibit } from '../types/index.js';
import { useVisitor } from '../contexts/VisitorContext.js';
import { translationService } from '../services/translationService.js';

interface ExhibitCardProps {
  exhibit: Exhibit;
  compact?: boolean;
}

export const ExhibitCard: React.FC<ExhibitCardProps> = ({ exhibit, compact = false }) => {
  const { language, favorites, toggleFavorite, playAudio, t } = useVisitor();
  const navigate = useNavigate();

  const isFav = favorites.includes(exhibit.exhibitId);
  const localized = translationService.getExhibitTranslation(exhibit, language);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playAudio(exhibit);
  };

  const handleAskAI = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/ai?exhibitId=${exhibit.exhibitId}`);
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/map?target=${exhibit.exhibitId}`);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(exhibit.exhibitId);
  };

  return (
    <div className="group bg-[#15181D] hover:bg-[#1A1E24] border border-museum-border/70 hover:border-museum-gold/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-gold-glow/20">
      {/* Artwork Image Container */}
      <Link to={`/exhibit/${exhibit.exhibitId}`} className="block relative aspect-[4/3] overflow-hidden bg-museum-elevated">
        <img
          src={exhibit.images[0]}
          alt={localized.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15181D] via-transparent to-transparent opacity-80" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-museum-gold border border-museum-gold/30">
            {localized.category || exhibit.category}
          </span>
          <button
            onClick={handleToggleFav}
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFav
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-black/60 text-white/80 hover:text-white border border-white/10 hover:border-white/30'
            }`}
            title="Favorite Artwork"
          >
            <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Gallery location pill at bottom of image */}
        <div className="absolute bottom-2.5 left-3">
          <span className="text-[11px] font-mono text-museum-cyan bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-museum-cyan/30">
            {exhibit.location}
          </span>
        </div>
      </Link>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-museum-muted mb-1">
            <span className="truncate">{exhibit.artist}</span>
            <span className="font-mono text-museum-gold flex-shrink-0">{exhibit.year}</span>
          </div>

          <Link to={`/exhibit/${exhibit.exhibitId}`}>
            <h3 className="text-lg font-serif font-bold text-white group-hover:text-museum-gold transition-colors line-clamp-1 mb-1">
              {localized.title}
            </h3>
          </Link>

          {!compact && (
            <p className="text-xs text-museum-muted line-clamp-2 mb-4 leading-relaxed">
              {localized.description}
            </p>
          )}
        </div>

        {/* Quick Action Bar */}
        <div className="pt-3 border-t border-museum-border/40 flex items-center justify-between gap-1.5 mt-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayAudio}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-museum-elevated hover:bg-museum-gold/20 text-museum-gold border border-museum-gold/20 text-xs font-medium transition-all"
              title="Listen Audio Guide"
            >
              <Headphones size={13} />
              <span>{t('listen')}</span>
            </button>

            <button
              onClick={handleAskAI}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-museum-elevated hover:bg-museum-cyan/20 text-museum-cyan border border-museum-cyan/20 text-xs font-medium transition-all"
              title="Ask AI Art Expert"
            >
              <Sparkles size={13} />
              <span>{t('askAI')}</span>
            </button>
          </div>

          <button
            onClick={handleNavigate}
            className="flex items-center gap-1 p-1.5 rounded-lg bg-museum-elevated hover:bg-white/10 text-museum-muted hover:text-white border border-museum-border text-xs transition-colors"
            title="Navigate to Artwork on Floor Map"
          >
            <Navigation size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

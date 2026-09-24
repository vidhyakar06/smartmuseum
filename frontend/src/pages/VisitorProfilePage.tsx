import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, Compass, Headphones, Ticket as TicketIcon, QrCode, Sparkles, ExternalLink } from 'lucide-react';
import { useVisitor } from '../contexts/VisitorContext.js';
import { api, getVisitorSessionId } from '../services/api.js';
import { Exhibit } from '../types/index.js';
import { ExhibitCard } from '../components/ExhibitCard.js';

export const VisitorProfilePage: React.FC = () => {
  const { favorites, visitedExhibits, currentLocation, language } = useVisitor();
  const [favoriteArtworks, setFavoriteArtworks] = useState<Exhibit[]>([]);
  const sessionId = getVisitorSessionId();

  useEffect(() => {
    api.getExhibits().then(res => {
      if (res.success) {
        setFavoriteArtworks(res.data.filter(e => favorites.includes(e.exhibitId)));
      }
    }).catch(() => {});
  }, [favorites]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Profile Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-museum-gold/30 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-museum-gold to-museum-gold-light text-black flex items-center justify-center font-bold text-3xl shadow-gold-glow/30 flex-shrink-0">
          👤
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-museum-gold/10 border border-museum-gold/30 text-museum-gold text-xs font-semibold mb-2">
            <span>BYOD Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
            Visitor Digital Companion
          </h1>
          <p className="text-xs text-museum-muted font-mono mb-4">
            Session ID: {sessionId}
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-museum-border/50 text-xs">
            <div>
              <p className="text-museum-muted text-[11px]">Visited Exhibits</p>
              <p className="text-lg font-bold text-white">{visitedExhibits.length}</p>
            </div>
            <div>
              <p className="text-museum-muted text-[11px]">Favorited Works</p>
              <p className="text-lg font-bold text-museum-gold">{favorites.length}</p>
            </div>
            <div>
              <p className="text-museum-muted text-[11px]">Current Zone</p>
              <p className="text-xs font-semibold text-museum-cyan truncate">{currentLocation.name.split(' - ')[0]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Souvenir Pass Card */}
      <div className="bg-[#15181D] border border-museum-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-museum-cyan/20 text-museum-cyan flex items-center justify-center flex-shrink-0">
            <TicketIcon size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Digital Museum Access Pass</h3>
            <p className="text-xs text-museum-muted">
              Admit One • General Exhibition Access • Audio Guide Enabled
            </p>
          </div>
        </div>

        <Link
          to="/scan"
          className="px-4 py-2.5 rounded-xl bg-museum-elevated border border-museum-border hover:border-museum-gold text-white text-xs font-semibold transition-all flex items-center gap-2"
        >
          <QrCode size={16} />
          <span>Scan Next Exhibit</span>
        </Link>
      </div>

      {/* Favorited Masterpieces Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Heart size={20} className="text-red-400" />
            <span>Favorited Masterpieces ({favoriteArtworks.length})</span>
          </h2>
        </div>

        {favoriteArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteArtworks.map(ex => (
              <ExhibitCard key={ex.exhibitId} exhibit={ex} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#15181D] border border-museum-border text-center text-xs text-museum-muted space-y-3">
            <p>You have not bookmarked any artworks yet.</p>
            <Link
              to="/explore"
              className="inline-block px-4 py-2 rounded-xl bg-museum-gold text-black font-semibold hover:scale-105 transition-all"
            >
              Browse Art Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

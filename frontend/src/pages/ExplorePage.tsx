import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../services/api.js';
import { Exhibit, Gallery } from '../types/index.js';
import { ExhibitCard } from '../components/ExhibitCard.js';
import { useVisitor } from '../contexts/VisitorContext.js';

export const ExplorePage: React.FC = () => {
  const { favorites, t } = useVisitor();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGallery, setSelectedGallery] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getExhibits(),
      api.getGalleries()
    ]).then(([exRes, galRes]) => {
      if (exRes.success) setExhibits(exRes.data);
      if (galRes.success) setGalleries(galRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'Renaissance', label: 'Renaissance' },
    { id: 'Impressionism', label: 'Impressionism' },
    { id: 'Surrealism', label: 'Surrealism' },
    { id: 'Sculpture', label: 'Sculptures' },
    { id: 'Asian', label: 'Asian Heritage' },
    { id: 'Baroque', label: 'Baroque' }
  ];

  const filteredExhibits = exhibits.filter(ex => {
    if (showFavoritesOnly && !favorites.includes(ex.exhibitId)) return false;

    if (selectedCategory !== 'all' && !ex.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }

    if (selectedGallery !== 'all' && ex.galleryId !== selectedGallery) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        ex.title.toLowerCase().includes(q) ||
        ex.artist.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q) ||
        ex.location.toLowerCase().includes(q) ||
        ex.exhibitId.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Explore Masterpieces</h1>
        <p className="text-sm text-museum-muted">
          Browse world-class artworks curated across 5 thematic galleries with instant AI guidance and audio commentary.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel rounded-2xl p-4 border border-museum-border space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-museum-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by artwork name, painter, movement, or room..."
            className="w-full pl-11 pr-10 py-3 bg-[#0E1116] border border-museum-border rounded-xl text-sm text-white placeholder-museum-muted focus:outline-none focus:border-museum-gold focus:ring-1 focus:ring-museum-gold transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-museum-muted hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-museum-gold text-black font-bold shadow-md shadow-museum-gold/20'
                  : 'bg-museum-elevated hover:bg-museum-border text-museum-muted hover:text-white border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery & Favorite Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-museum-border/50 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-museum-muted">Filter by Gallery:</span>
            <select
              value={selectedGallery}
              onChange={(e) => setSelectedGallery(e.target.value)}
              className="bg-[#0E1116] border border-museum-border rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-museum-gold"
            >
              <option value="all">All Galleries</option>
              {galleries.map(g => (
                <option key={g.galleryId} value={g.galleryId}>{g.name.split(' - ')[0]}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs transition-colors ${
              showFavoritesOnly
                ? 'bg-red-500/20 text-red-300 border-red-500/40 font-semibold'
                : 'bg-museum-elevated text-museum-muted hover:text-white border-museum-border'
            }`}
          >
            <Heart size={13} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
            <span>Favorites ({favorites.length})</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-museum-muted px-1">
        <span>Showing {filteredExhibits.length} of {exhibits.length} works</span>
        {(search || selectedCategory !== 'all' || selectedGallery !== 'all' || showFavoritesOnly) && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedGallery('all');
              setShowFavoritesOnly(false);
            }}
            className="text-museum-gold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Exhibits Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-[4/5] bg-museum-elevated rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredExhibits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExhibits.map(exhibit => (
            <ExhibitCard key={exhibit.exhibitId} exhibit={exhibit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#15181D] rounded-2xl border border-museum-border p-6">
          <p className="text-museum-muted text-base mb-2">No artworks match your search or filter criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedGallery('all');
              setShowFavoritesOnly(false);
            }}
            className="px-4 py-2 bg-museum-gold text-black font-semibold rounded-xl text-xs hover:scale-105 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

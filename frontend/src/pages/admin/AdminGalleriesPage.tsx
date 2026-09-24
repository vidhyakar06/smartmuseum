import React, { useState, useEffect } from 'react';
import { Building2, Users, AlertTriangle, CheckCircle2, Sliders, Radio } from 'lucide-react';
import { api } from '../../services/api.js';
import { Gallery } from '../../types/index.js';

export const AdminGalleriesPage: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGalleries = () => {
    setLoading(true);
    api.getGalleries().then(res => {
      if (res.success) setGalleries(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleOccupancyChange = async (galleryId: string, val: number) => {
    setGalleries(prev =>
      prev.map(g => (g.galleryId === galleryId ? { ...g, currentOccupancy: val } : g))
    );
    try {
      await api.updateGalleryOccupancy(galleryId, val);
      fetchGalleries();
    } catch {
      // rollback
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">
          Crowd Density & Facility Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Galleries & Bottleneck Controls
        </h1>
        <p className="text-xs text-museum-muted mt-1">
          Adjust live occupancy sliders to test simulated bottleneck thresholds and real-time visitor rerouting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map(gal => {
          const ratio = Math.round((gal.currentOccupancy / gal.capacity) * 100);
          const isOver = gal.currentOccupancy >= gal.capacity;
          const isWarning = ratio >= 80 && !isOver;

          return (
            <div
              key={gal.galleryId}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isOver
                  ? 'bg-red-950/30 border-red-500/50 shadow-lg shadow-red-950/40'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-[#15181D] border-museum-border'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: gal.themeColor || '#D4AF37' }}
                    />
                    <span className="font-mono text-xs text-museum-gold font-semibold">{gal.galleryId}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isOver
                      ? 'bg-red-500 text-white animate-pulse'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {isOver ? 'Bottleneck' : isWarning ? 'High Density' : 'Normal Flow'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{gal.name}</h3>
                <p className="text-xs text-museum-muted line-clamp-2 mb-4">{gal.description}</p>

                <div className="p-3 rounded-xl bg-museum-elevated/70 border border-museum-border/60 text-xs space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-museum-muted">Floor Level</span>
                    <span className="text-white font-mono">Floor {gal.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-museum-muted">Beacon ID</span>
                    <span className="text-museum-cyan font-mono">{gal.beaconId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-museum-muted">Recommended Alternate</span>
                    <span className="text-museum-gold font-mono">{gal.recommendedAlternative || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Live Occupancy Slider to trigger Bottleneck Demo */}
              <div className="space-y-2 pt-3 border-t border-museum-border/40">
                <div className="flex justify-between text-xs">
                  <span className="text-museum-muted font-medium">Live Occupancy</span>
                  <span className="text-white font-bold font-mono">
                    {gal.currentOccupancy} / {gal.capacity} ({ratio}%)
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={gal.capacity * 1.5}
                  value={gal.currentOccupancy}
                  onChange={(e) => handleOccupancyChange(gal.galleryId, Number(e.target.value))}
                  className="w-full h-2 bg-museum-elevated rounded-lg cursor-pointer accent-museum-gold"
                />

                <p className="text-[10px] text-museum-muted text-center pt-1">
                  Drag slider above {gal.capacity} to trigger active crowd bottleneck alert.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

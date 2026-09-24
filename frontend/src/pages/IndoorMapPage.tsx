import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, MapPin, Navigation, Radio, Layers, AlertTriangle } from 'lucide-react';
import { api } from '../services/api.js';
import { Exhibit, Gallery } from '../types/index.js';
import { FloorMap } from '../components/FloorMap.js';
import { useVisitor } from '../contexts/VisitorContext.js';

export const IndoorMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const targetFromUrl = searchParams.get('target') || undefined;

  const { currentLocation, setBeacon, t } = useVisitor();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-museum-cyan/10 border border-museum-cyan/30 text-museum-cyan text-xs font-semibold mb-2">
            <Navigation size={12} />
            <span>Interactive Vector Floorplan & Wayfinding</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">Indoor Museum Navigation</h1>
          <p className="text-xs sm:text-sm text-museum-muted">
            Tap any gallery or artwork pin to calculate the shortest corridor path with live turn-by-turn walking steps.
          </p>
        </div>

        {/* Current Location Pill */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-museum-elevated border border-museum-border text-xs">
          <div className="w-8 h-8 rounded-full bg-museum-cyan/20 text-museum-cyan flex items-center justify-center">
            <Radio size={16} className="animate-pulse" />
          </div>
          <div>
            <span className="text-museum-muted text-[10px] block uppercase font-mono">Current Zone</span>
            <span className="text-white font-bold">{currentLocation.name.split(' - ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Main Floor Map Component */}
      {loading ? (
        <div className="h-96 rounded-2xl bg-[#15181D] border border-museum-border flex items-center justify-center text-museum-muted text-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-museum-cyan border-t-transparent rounded-full animate-spin" />
            <span>Loading museum vector floorplan...</span>
          </div>
        </div>
      ) : (
        <FloorMap
          exhibits={exhibits}
          galleries={galleries}
          selectedExhibitId={targetFromUrl}
        />
      )}
    </div>
  );
};

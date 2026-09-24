import React, { useState, useEffect } from 'react';
import { Radio, AlertTriangle, ChevronRight, Navigation2, Check } from 'lucide-react';
import { useVisitor } from '../contexts/VisitorContext.js';
import { BEACON_CHECKPOINTS } from '../services/locationService.js';
import { api } from '../services/api.js';
import { Gallery } from '../types/index.js';

export const BeaconBar: React.FC = () => {
  const { currentLocation, setBeacon, t } = useVisitor();
  const [isOpen, setIsOpen] = useState(false);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    api.getGalleries().then(res => {
      if (res.success) setGalleries(res.data);
    }).catch(() => {});
  }, []);

  const currentGalleryData = galleries.find(g => g.galleryId === currentLocation.galleryId);
  const isCrowded = currentGalleryData?.alertLevel === 'red';

  return (
    <div className="w-full bg-[#11141A] border-b border-museum-border/60 text-xs px-4 py-2 relative z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Current Beacon Status Indicator */}
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-museum-gold/10 text-museum-gold border border-museum-gold/30 flex-shrink-0">
            <Radio size={13} className="animate-pulse" />
          </div>
          <div className="truncate">
            <span className="text-museum-muted font-medium">Beacon: </span>
            <span className="text-white font-semibold">{currentLocation.name}</span>
          </div>
        </div>

        {/* Bottleneck Warning Pill if high traffic */}
        {isCrowded && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse">
            <AlertTriangle size={12} />
            <span className="font-medium">Capacity Alert ({currentGalleryData?.occupancyRatio}%)</span>
          </div>
        )}

        {/* Beacon Simulator Toggle for Demo */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-museum-elevated hover:bg-museum-border text-museum-gold border border-museum-gold/20 font-medium transition-all"
        >
          <span>Simulate Beacon</span>
          <ChevronRight size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Dropdown Simulation Drawer */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#15181D] border-b border-museum-border shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Navigation2 size={15} className="text-museum-cyan" />
                  Bluetooth Low Energy (BLE) Beacon Simulator
                </h4>
                <p className="text-museum-muted text-xs">
                  Click a checkpoint to simulate physical visitor movement through museum zones.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-museum-muted hover:text-white px-2 py-1 bg-white/5 rounded"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {BEACON_CHECKPOINTS.map((checkpoint) => {
                const isSelected = currentLocation.beaconId === checkpoint.beaconId;
                const galleryInfo = galleries.find(g => g.galleryId === checkpoint.galleryId);
                const isHighTraffic = galleryInfo?.alertLevel === 'red';

                return (
                  <button
                    key={checkpoint.beaconId}
                    onClick={() => {
                      setBeacon(checkpoint.beaconId);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-museum-gold/15 border-museum-gold text-white shadow-gold-glow'
                        : 'bg-museum-elevated/80 border-museum-border/60 text-museum-muted hover:border-museum-gold/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-museum-cyan truncate">{checkpoint.beaconId}</span>
                      {isSelected && <Check size={13} className="text-museum-gold flex-shrink-0" />}
                    </div>
                    <div className="text-xs font-semibold text-white truncate">{checkpoint.name.split(' - ')[0]}</div>
                    <div className="text-[10px] text-museum-muted mt-1 flex items-center justify-between">
                      <span>Floor {checkpoint.floor}</span>
                      {isHighTraffic && (
                        <span className="text-red-400 font-bold">Crowded</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

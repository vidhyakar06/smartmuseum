import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Compass,
  Coffee,
  Info,
  DoorOpen,
  MapPin,
  Clock,
  ArrowRight,
  Headphones,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Exhibit, Gallery } from '../types/index.js';
import { useVisitor } from '../contexts/VisitorContext.js';

interface FloorMapProps {
  exhibits: Exhibit[];
  galleries: Gallery[];
  selectedExhibitId?: string;
  onSelectExhibit?: (exhibit: Exhibit) => void;
}

// Fixed navigation graph nodes (corridors and doors) for realistic indoor wayfinding
const NAV_NODES = {
  ENTRANCE: { id: 'ENTRANCE', x: 500, y: 540, label: 'Main Entrance' },
  ATRIUM: { id: 'ATRIUM', x: 500, y: 440, label: 'Central Atrium' },
  HALL_SOUTH: { id: 'HALL_SOUTH', x: 500, y: 390, label: 'South Corridor' },
  HALL_CENTER: { id: 'HALL_CENTER', x: 500, y: 250, label: 'Central Crossway' },
  HALL_NORTH: { id: 'HALL_NORTH', x: 500, y: 150, label: 'North Corridor' },
  DOOR_GAL_A: { id: 'DOOR_GAL_A', x: 340, y: 150, label: 'Gallery A Entrance' },
  DOOR_GAL_B: { id: 'DOOR_GAL_B', x: 500, y: 110, label: 'Gallery B Entrance' },
  DOOR_GAL_C: { id: 'DOOR_GAL_C', x: 660, y: 150, label: 'Gallery C Entrance' },
  DOOR_GAL_D: { id: 'DOOR_GAL_D', x: 340, y: 390, label: 'Gallery D Entrance' },
  DOOR_GAL_E: { id: 'DOOR_GAL_E', x: 660, y: 390, label: 'Gallery E Entrance' },
  RESTROOMS: { id: 'RESTROOMS', x: 340, y: 480, label: 'Restrooms' },
  CAFE: { id: 'CAFE', x: 660, y: 480, label: 'Museum Café' },
  INFO_DESK: { id: 'INFO_DESK', x: 420, y: 530, label: 'Information Desk' },
  EMERGENCY_EXIT: { id: 'EMERGENCY_EXIT', x: 920, y: 50, label: 'Emergency Exit' }
};

export const FloorMap: React.FC<FloorMapProps> = ({
  exhibits,
  galleries,
  selectedExhibitId,
  onSelectExhibit
}) => {
  const { currentLocation, setBeacon, t } = useVisitor();
  const navigate = useNavigate();

  const [activeTargetId, setActiveTargetId] = useState<string>(selectedExhibitId || 'EX002');
  const [activeAmenity, setActiveAmenity] = useState<string | null>(null);
  const [filterLayer, setFilterLayer] = useState<'all' | 'paintings' | 'sculptures' | 'amenities'>('all');
  const [hoveredExhibit, setHoveredExhibit] = useState<Exhibit | null>(null);

  // Determine current visitor node coordinates on map
  const visitorCoord = useMemo(() => {
    switch (currentLocation.galleryId) {
      case 'GAL_A': return { x: 190, y: 150 };
      case 'GAL_B': return { x: 510, y: 150 };
      case 'GAL_C': return { x: 830, y: 150 };
      case 'GAL_D': return { x: 190, y: 390 };
      case 'GAL_E': return { x: 830, y: 390 };
      default: return { x: 500, y: 540 }; // Atrium/Entrance
    }
  }, [currentLocation.galleryId]);

  // Target destination coordinates
  const targetExhibit = exhibits.find(e => e.exhibitId === activeTargetId);
  const targetCoord = useMemo(() => {
    if (activeAmenity === 'CAFE') return { x: 660, y: 480 };
    if (activeAmenity === 'RESTROOMS') return { x: 340, y: 480 };
    if (activeAmenity === 'INFO_DESK') return { x: 420, y: 530 };
    if (activeAmenity === 'EMERGENCY_EXIT') return { x: 920, y: 50 };
    if (targetExhibit) return { x: targetExhibit.coordinates.x, y: targetExhibit.coordinates.y };
    return { x: 440, y: 90 }; // default
  }, [targetExhibit, activeAmenity]);

  // Compute calculated path coordinates and turn-by-turn steps
  const wayfinding = useMemo(() => {
    const points: Array<{ x: number; y: number }> = [visitorCoord];
    const steps: string[] = ['You are here'];
    let totalDist = 0;

    // Route from current gallery door to central hall
    if (currentLocation.galleryId === 'GAL_A') {
      points.push(NAV_NODES.DOOR_GAL_A);
      points.push(NAV_NODES.HALL_NORTH);
      totalDist += 18;
      steps.push('Exit Gallery A into North Corridor (18m)');
    } else if (currentLocation.galleryId === 'GAL_B') {
      points.push(NAV_NODES.DOOR_GAL_B);
      points.push(NAV_NODES.HALL_NORTH);
      totalDist += 12;
      steps.push('Walk south to Central Hallway (12m)');
    } else if (currentLocation.galleryId === 'GAL_C') {
      points.push(NAV_NODES.DOOR_GAL_C);
      points.push(NAV_NODES.HALL_NORTH);
      totalDist += 18;
      steps.push('Exit Gallery C into North Corridor (18m)');
    } else if (currentLocation.galleryId === 'GAL_D') {
      points.push(NAV_NODES.DOOR_GAL_D);
      points.push(NAV_NODES.HALL_SOUTH);
      totalDist += 20;
      steps.push('Walk towards Central Atrium (20m)');
    } else if (currentLocation.galleryId === 'GAL_E') {
      points.push(NAV_NODES.DOOR_GAL_E);
      points.push(NAV_NODES.HALL_SOUTH);
      totalDist += 20;
      steps.push('Exit Asian Pavilion to South Corridor (20m)');
    } else {
      points.push(NAV_NODES.HALL_SOUTH);
      totalDist += 15;
      steps.push('Proceed through Entrance Hall (15m)');
    }

    // Connect north and south hall if crossing
    const targetGallery = targetExhibit?.galleryId;
    if (targetGallery === 'GAL_A') {
      points.push(NAV_NODES.HALL_NORTH);
      points.push(NAV_NODES.DOOR_GAL_A);
      points.push(targetCoord);
      totalDist += 25;
      steps.push('Turn left into Gallery A (Renaissance Masters)');
      steps.push(`Arrive at "${targetExhibit?.title}" on display`);
    } else if (targetGallery === 'GAL_B') {
      points.push(NAV_NODES.HALL_NORTH);
      points.push(NAV_NODES.DOOR_GAL_B);
      points.push(targetCoord);
      totalDist += 20;
      steps.push('Enter Gallery B (Impressionism & Van Gogh)');
      steps.push(`Arrive at "${targetExhibit?.title}"`);
    } else if (targetGallery === 'GAL_C') {
      points.push(NAV_NODES.HALL_NORTH);
      points.push(NAV_NODES.DOOR_GAL_C);
      points.push(targetCoord);
      totalDist += 28;
      steps.push('Proceed right into Gallery C (Modern & Surrealism)');
      steps.push(`Arrive at "${targetExhibit?.title}"`);
    } else if (targetGallery === 'GAL_D') {
      points.push(NAV_NODES.HALL_SOUTH);
      points.push(NAV_NODES.DOOR_GAL_D);
      points.push(targetCoord);
      totalDist += 22;
      steps.push('Turn left into Gallery D (Sculptural Court)');
      steps.push(`Arrive at "${targetExhibit?.title}"`);
    } else if (targetGallery === 'GAL_E') {
      points.push(NAV_NODES.HALL_SOUTH);
      points.push(NAV_NODES.DOOR_GAL_E);
      points.push(targetCoord);
      totalDist += 25;
      steps.push('Turn right into Gallery E (Asian Heritage)');
      steps.push(`Arrive at "${targetExhibit?.title}"`);
    } else if (activeAmenity) {
      points.push(targetCoord);
      totalDist += 12;
      steps.push(`Arrive at ${activeAmenity.replace('_', ' ')}`);
    }

    const walkingMinutes = Math.max(1, Math.round(totalDist / 25));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return {
      pathD,
      distance: `${totalDist}m`,
      time: `~${walkingMinutes} min`,
      steps
    };
  }, [visitorCoord, targetCoord, currentLocation.galleryId, targetExhibit, activeAmenity]);

  const handleExhibitClick = (ex: Exhibit) => {
    setActiveTargetId(ex.exhibitId);
    setActiveAmenity(null);
    if (onSelectExhibit) onSelectExhibit(ex);
  };

  const handleAmenityClick = (amenityKey: string) => {
    setActiveAmenity(amenityKey);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Interactive Vector Map Canvas */}
      <div className="w-full lg:flex-1 bg-[#0F1217] border border-museum-border rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Map Toolbar */}
        <div className="p-3 bg-[#15181D]/90 backdrop-blur-md border-b border-museum-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-museum-gold flex items-center gap-1.5">
              <Compass size={15} />
              Floor 1 Vector Plan
            </span>
            <span className="text-museum-muted font-mono text-[11px] px-2 py-0.5 rounded bg-museum-elevated">
              Live BLE Tracking
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilterLayer('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filterLayer === 'all' ? 'bg-museum-gold text-black font-semibold' : 'bg-museum-elevated text-museum-muted hover:text-white'
              }`}
            >
              All Artworks
            </button>
            <button
              onClick={() => setFilterLayer('paintings')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filterLayer === 'paintings' ? 'bg-museum-gold text-black font-semibold' : 'bg-museum-elevated text-museum-muted hover:text-white'
              }`}
            >
              Paintings
            </button>
            <button
              onClick={() => setFilterLayer('sculptures')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filterLayer === 'sculptures' ? 'bg-museum-gold text-black font-semibold' : 'bg-museum-elevated text-museum-muted hover:text-white'
              }`}
            >
              Sculptures
            </button>
            <button
              onClick={() => setFilterLayer('amenities')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filterLayer === 'amenities' ? 'bg-museum-gold text-black font-semibold' : 'bg-museum-elevated text-museum-muted hover:text-white'
              }`}
            >
              Amenities
            </button>
          </div>
        </div>

        {/* SVG Museum Floor Plan */}
        <div className="relative overflow-x-auto p-2 sm:p-4 flex items-center justify-center">
          <svg
            viewBox="0 0 1000 620"
            className="w-full h-auto max-h-[580px] select-none"
            style={{ minWidth: '600px' }}
          >
            <defs>
              <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E232B" />
                <stop offset="100%" stopColor="#13161C" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Museum Outer Boundary & Corridor Foundation */}
            <rect x="20" y="20" width="960" height="580" rx="16" fill="url(#corridorGlow)" stroke="#2A303C" strokeWidth="2" />

            {/* Main Corridors */}
            {/* North-South Hallway */}
            <rect x="340" y="210" width="320" height="170" fill="#15181D" stroke="#252A34" strokeDasharray="4,4" />

            {/* Gallery A (Top Left) */}
            <g
              className="cursor-pointer transition-opacity hover:opacity-95"
              onClick={() => setBeacon('BEACON_GALLERY_A')}
            >
              <rect x="50" y="40" width="270" height="200" rx="10" fill="#181B22" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="70" y="70" fill="#D4AF37" fontSize="14" fontWeight="bold" fontFamily="Playfair Display">Gallery A</text>
              <text x="70" y="88" fill="#94A3B8" fontSize="11">Renaissance & Classical</text>
              <rect x="70" y="98" width="65" height="18" rx="4" fill="#D4AF37" fillOpacity="0.15" />
              <text x="75" y="111" fill="#F3E5AB" fontSize="10" fontWeight="600">Cap: 84/100</text>
            </g>

            {/* Gallery B (Top Center) - Bottleneck demo */}
            <g
              className="cursor-pointer transition-opacity hover:opacity-95"
              onClick={() => setBeacon('BEACON_GALLERY_B')}
            >
              <rect x="360" y="40" width="280" height="200" rx="10" fill="#181B22" stroke="#EF4444" strokeWidth="2" strokeOpacity="0.8" />
              <text x="380" y="70" fill="#38BDF8" fontSize="14" fontWeight="bold" fontFamily="Playfair Display">Gallery B</text>
              <text x="380" y="88" fill="#94A3B8" fontSize="11">Impressionism & Van Gogh</text>
              <rect x="380" y="98" width="85" height="18" rx="4" fill="#EF4444" fillOpacity="0.2" />
              <text x="385" y="111" fill="#FCA5A5" fontSize="10" fontWeight="700">⚠️ High: 102/90</text>
            </g>

            {/* Gallery C (Top Right) */}
            <g
              className="cursor-pointer transition-opacity hover:opacity-95"
              onClick={() => setBeacon('BEACON_GALLERY_C')}
            >
              <rect x="680" y="40" width="270" height="200" rx="10" fill="#181B22" stroke="#EC4899" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="700" y="70" fill="#EC4899" fontSize="14" fontWeight="bold" fontFamily="Playfair Display">Gallery C</text>
              <text x="700" y="88" fill="#94A3B8" fontSize="11">Modern & Surrealism</text>
              <rect x="700" y="98" width="65" height="18" rx="4" fill="#EC4899" fillOpacity="0.15" />
              <text x="705" y="111" fill="#FBCFE8" fontSize="10" fontWeight="600">Cap: 42/80</text>
            </g>

            {/* Gallery D (Bottom Left) */}
            <g
              className="cursor-pointer transition-opacity hover:opacity-95"
              onClick={() => setBeacon('BEACON_GALLERY_D')}
            >
              <rect x="50" y="280" width="270" height="210" rx="10" fill="#181B22" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="70" y="310" fill="#10B981" fontSize="14" fontWeight="bold" fontFamily="Playfair Display">Gallery D</text>
              <text x="70" y="328" fill="#94A3B8" fontSize="11">Sculptures & Michelangelo</text>
              <rect x="70" y="338" width="65" height="18" rx="4" fill="#10B981" fillOpacity="0.15" />
              <text x="75" y="351" fill="#A7F3D0" fontSize="10" fontWeight="600">Cap: 28/75</text>
            </g>

            {/* Gallery E (Bottom Right) */}
            <g
              className="cursor-pointer transition-opacity hover:opacity-95"
              onClick={() => setBeacon('BEACON_GALLERY_E')}
            >
              <rect x="680" y="280" width="270" height="210" rx="10" fill="#181B22" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.4" />
              <text x="700" y="310" fill="#8B5CF6" fontSize="14" fontWeight="bold" fontFamily="Playfair Display">Gallery E</text>
              <text x="700" y="328" fill="#94A3B8" fontSize="11">Asian Heritage & Hokusai</text>
              <rect x="700" y="338" width="65" height="18" rx="4" fill="#8B5CF6" fillOpacity="0.15" />
              <text x="705" y="351" fill="#DDD6FE" fontSize="10" fontWeight="600">Cap: 35/85</text>
            </g>

            {/* Central Atrium & Grand Foyer (Bottom Center) */}
            <rect x="360" y="420" width="280" height="150" rx="10" fill="#1A1E26" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.3" />
            <text x="430" y="450" fill="#38BDF8" fontSize="13" fontWeight="bold">Grand Atrium</text>
            <text x="420" y="468" fill="#64748B" fontSize="10">Entrance, Tickets & Lobby</text>

            {/* Amenities Nodes */}
            {/* Cafe */}
            <g
              className="cursor-pointer"
              onClick={() => handleAmenityClick('CAFE')}
            >
              <circle cx="660" cy="480" r="16" fill="#1E232B" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="653" y="485" fill="#F59E0B" fontSize="14">☕</text>
              <text x="645" y="508" fill="#F59E0B" fontSize="9" fontWeight="600">Café</text>
            </g>

            {/* Restrooms */}
            <g
              className="cursor-pointer"
              onClick={() => handleAmenityClick('RESTROOMS')}
            >
              <circle cx="340" cy="480" r="16" fill="#1E232B" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="333" y="485" fill="#38BDF8" fontSize="14">🚻</text>
              <text x="320" y="508" fill="#38BDF8" fontSize="9" fontWeight="600">Restrooms</text>
            </g>

            {/* Information Desk */}
            <g
              className="cursor-pointer"
              onClick={() => handleAmenityClick('INFO_DESK')}
            >
              <circle cx="420" cy="530" r="14" fill="#1E232B" stroke="#D4AF37" strokeWidth="1.5" />
              <text x="414" y="535" fill="#D4AF37" fontSize="13">ℹ️</text>
            </g>

            {/* Emergency Exit */}
            <g
              className="cursor-pointer"
              onClick={() => handleAmenityClick('EMERGENCY_EXIT')}
            >
              <rect x="910" y="40" width="30" height="24" rx="4" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" />
              <text x="915" y="56" fill="#EF4444" fontSize="10" fontWeight="bold">EXIT</text>
            </g>

            {/* Navigation Path Polyline */}
            <path
              d={wayfinding.pathD}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8,6"
              className="animate-pulse"
            />

            {/* Destination Target Marker */}
            <g transform={`translate(${targetCoord.x}, ${targetCoord.y})`}>
              <circle r="14" fill="#D4AF37" fillOpacity="0.3" className="animate-ping" />
              <circle r="10" fill="#D4AF37" stroke="#FFFFFF" strokeWidth="2" />
              <circle r="4" fill="#0B0D10" />
            </g>

            {/* "You Are Here" Visitor Marker */}
            <g transform={`translate(${visitorCoord.x}, ${visitorCoord.y})`}>
              <circle r="18" fill="#38BDF8" fillOpacity="0.3" className="animate-ping" />
              <circle r="10" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5" />
              <circle r="4" fill="#FFFFFF" />
              <text x="-30" y="-18" fill="#38BDF8" fontSize="11" fontWeight="bold">YOU ARE HERE</text>
            </g>

            {/* Exhibit Location Pins */}
            {exhibits.map(ex => {
              const isSelected = ex.exhibitId === activeTargetId;
              const isSculpture = ex.category.toLowerCase().includes('sculpture');

              if (filterLayer === 'paintings' && isSculpture) return null;
              if (filterLayer === 'sculptures' && !isSculpture) return null;

              return (
                <g
                  key={ex.exhibitId}
                  transform={`translate(${ex.coordinates.x}, ${ex.coordinates.y})`}
                  className="cursor-pointer"
                  onClick={() => handleExhibitClick(ex)}
                  onMouseEnter={() => setHoveredExhibit(ex)}
                  onMouseLeave={() => setHoveredExhibit(null)}
                >
                  <circle
                    r={isSelected ? "11" : "8"}
                    fill={isSelected ? "#D4AF37" : "#1E232B"}
                    stroke={isSelected ? "#FFFFFF" : "#D4AF37"}
                    strokeWidth={isSelected ? "2" : "1.5"}
                    className="transition-all hover:scale-125"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={isSelected ? "#000" : "#D4AF37"}
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {ex.exhibitId.replace('EX0', '').replace('EX', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover preview tooltip */}
        {hoveredExhibit && (
          <div className="absolute top-14 left-4 bg-[#15181D]/95 border border-museum-gold/30 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs max-w-xs pointer-events-none z-30">
            <div className="flex gap-2.5 items-center">
              <img src={hoveredExhibit.images[0]} alt={hoveredExhibit.title} className="w-10 h-10 object-cover rounded-lg border border-white/10" />
              <div>
                <p className="font-semibold text-white truncate">{hoveredExhibit.title}</p>
                <p className="text-museum-muted text-[11px]">{hoveredExhibit.artist} ({hoveredExhibit.year})</p>
                <span className="text-museum-gold text-[10px]">{hoveredExhibit.location}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wayfinding Route Panel & Turn-by-Turn Card */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        <div className="glass-panel-glow rounded-2xl p-5 border border-museum-gold/30 text-museum-text">
          <div className="flex items-center justify-between pb-3 border-b border-museum-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-museum-cyan/20 text-museum-cyan flex items-center justify-center">
                <Navigation size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Indoor Navigation</h4>
                <p className="text-xs text-museum-muted font-mono">Dijkstra Shortest Path</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <div className="text-sm font-bold text-museum-gold">{wayfinding.distance}</div>
                <div className="text-[11px] text-museum-muted flex items-center gap-1">
                  <Clock size={11} />
                  <span>{wayfinding.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Target Banner */}
          <div className="mt-4 p-3 rounded-xl bg-museum-elevated border border-museum-border/60">
            <div className="text-[11px] text-museum-muted uppercase tracking-wider mb-1">Destination Target</div>
            {targetExhibit ? (
              <div className="flex items-center justify-between gap-3">
                <div className="truncate">
                  <h5 className="text-sm font-bold text-white truncate">{targetExhibit.title}</h5>
                  <p className="text-xs text-museum-gold truncate">{targetExhibit.artist} • {targetExhibit.location}</p>
                </div>
                <button
                  onClick={() => navigate(`/exhibit/${targetExhibit.exhibitId}`)}
                  className="p-2 rounded-lg bg-museum-gold/20 text-museum-gold hover:bg-museum-gold hover:text-black transition-colors"
                  title="View Exhibit Details"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <div className="text-sm font-bold text-museum-cyan">{activeAmenity?.replace('_', ' ') || 'Select a point on the map'}</div>
            )}
          </div>

          {/* Step-by-Step Directions */}
          <div className="mt-4">
            <h6 className="text-xs font-semibold text-museum-muted uppercase tracking-wider mb-3">Turn-by-Turn Instructions</h6>
            <div className="space-y-2.5">
              {wayfinding.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0 ${
                    idx === 0
                      ? 'bg-museum-cyan text-black'
                      : idx === wayfinding.steps.length - 1
                      ? 'bg-museum-gold text-black'
                      : 'bg-museum-elevated text-museum-muted border border-museum-border'
                  }`}>
                    {idx === 0 ? '●' : idx}
                  </div>
                  <span className={idx === wayfinding.steps.length - 1 ? 'text-white font-semibold' : 'text-museum-text/90'}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Target Exhibit Picker */}
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4">
          <h5 className="text-xs font-semibold text-museum-gold uppercase tracking-wider mb-3">
            Quick Route Destinations
          </h5>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {exhibits.slice(0, 7).map(ex => (
              <button
                key={ex.exhibitId}
                onClick={() => handleExhibitClick(ex)}
                className={`w-full p-2 rounded-xl text-left flex items-center justify-between border transition-all text-xs ${
                  activeTargetId === ex.exhibitId
                    ? 'bg-museum-gold/15 border-museum-gold text-white font-semibold'
                    : 'bg-museum-elevated/60 border-transparent text-museum-muted hover:text-white hover:border-museum-border'
                }`}
              >
                <div className="truncate">
                  <div className="text-white truncate">{ex.title}</div>
                  <div className="text-[10px] text-museum-muted truncate">{ex.location}</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-museum-gold flex-shrink-0">
                  {ex.exhibitId}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

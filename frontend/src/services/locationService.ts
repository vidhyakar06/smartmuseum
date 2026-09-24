export interface MuseumLocation {
  id: string;
  name: string;
  galleryId: string;
  beaconId: string;
  floor: number;
  description: string;
  coordinates: { x: number; y: number };
}

export const BEACON_CHECKPOINTS: MuseumLocation[] = [
  { id: 'LOC_ENTRANCE', name: 'Main Entrance & Atrium', galleryId: 'ATRIUM', beaconId: 'BEACON_ENTRANCE', floor: 1, description: 'Welcome lobby, ticketing, and information desk.', coordinates: { x: 500, y: 560 } },
  { id: 'LOC_GAL_A', name: 'Gallery A - Renaissance', galleryId: 'GAL_A', beaconId: 'BEACON_GALLERY_A', floor: 1, description: 'Leonardo da Vinci, Vermeer, Raphael', coordinates: { x: 190, y: 150 } },
  { id: 'LOC_GAL_B', name: 'Gallery B - Impressionism', galleryId: 'GAL_B', beaconId: 'BEACON_GALLERY_B', floor: 1, description: 'Van Gogh, Munch, Klimt', coordinates: { x: 510, y: 150 } },
  { id: 'LOC_GAL_C', name: 'Gallery C - Modern & Surrealism', galleryId: 'GAL_C', beaconId: 'BEACON_GALLERY_C', floor: 1, description: 'Picasso, Salvador Dalí', coordinates: { x: 830, y: 150 } },
  { id: 'LOC_GAL_D', name: 'Gallery D - Sculptures', galleryId: 'GAL_D', beaconId: 'BEACON_GALLERY_D', floor: 1, description: 'Michelangelo Pietà, Rodin Thinker', coordinates: { x: 190, y: 390 } },
  { id: 'LOC_GAL_E', name: 'Gallery E - Asian Heritage', galleryId: 'GAL_E', beaconId: 'BEACON_GALLERY_E', floor: 1, description: 'Hokusai Great Wave, Silk scrolls', coordinates: { x: 830, y: 390 } },
];

export class LocationService {
  private currentLocation: MuseumLocation = BEACON_CHECKPOINTS[0];
  private isSimulating: boolean = false;

  constructor() {
    const saved = localStorage.getItem('smart_museum_beacon');
    if (saved) {
      const found = BEACON_CHECKPOINTS.find(b => b.beaconId === saved);
      if (found) this.currentLocation = found;
    }
  }

  public getCurrentLocation(): MuseumLocation {
    return this.currentLocation;
  }

  public setBeacon(beaconId: string): void {
    const target = BEACON_CHECKPOINTS.find(b => b.beaconId === beaconId);
    if (target) {
      this.currentLocation = target;
      localStorage.setItem('smart_museum_beacon', beaconId);
      window.dispatchEvent(new CustomEvent('museum_location_changed', { detail: target }));
    }
  }

  public getAllCheckpoints(): MuseumLocation[] {
    return BEACON_CHECKPOINTS;
  }
}

export const locationService = new LocationService();

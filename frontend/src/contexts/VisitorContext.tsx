import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, Exhibit } from '../types/index.js';
import { translationService } from '../services/translationService.js';
import { locationService, MuseumLocation } from '../services/locationService.js';
import { api, getVisitorSessionId } from '../services/api.js';

interface VisitorContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLocation: MuseumLocation;
  setBeacon: (beaconId: string) => void;
  favorites: string[];
  toggleFavorite: (exhibitId: string) => void;
  isFavorite: (exhibitId: string) => boolean;
  visitedExhibits: string[];
  markVisited: (exhibitId: string) => void;
  t: (key: string) => string;
  activeAudio: { exhibit?: Exhibit; isPlaying: boolean; progress: number } | null;
  playAudio: (exhibit: Exhibit) => void;
  pauseAudio: () => void;
  stopAudio: () => void;
  toggleAudio: (exhibit: Exhibit) => void;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<SupportedLanguage>(translationService.getLanguage());
  const [currentLocation, setCurrentLocation] = useState<MuseumLocation>(locationService.getCurrentLocation());
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smart_museum_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [visitedExhibits, setVisitedExhibits] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smart_museum_visited');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeAudio, setActiveAudio] = useState<{ exhibit?: Exhibit; isPlaying: boolean; progress: number } | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const sid = getVisitorSessionId();
    api.track('visit', undefined, undefined, { language, location: currentLocation.name, sessionId: sid });

    const handleLocChange = (e: any) => {
      if (e.detail) setCurrentLocation(e.detail);
    };
    const handleLangChange = (e: any) => {
      if (e.detail) setLangState(e.detail);
    };

    window.addEventListener('museum_location_changed', handleLocChange);
    window.addEventListener('language_changed', handleLangChange);

    return () => {
      window.removeEventListener('museum_location_changed', handleLocChange);
      window.removeEventListener('language_changed', handleLangChange);
    };
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    translationService.setLanguage(lang);
    setLangState(lang);
    api.track('language-change', undefined, undefined, { to: lang });
  };

  const setBeacon = (beaconId: string) => {
    locationService.setBeacon(beaconId);
    const updated = locationService.getCurrentLocation();
    setCurrentLocation(updated);
    api.track('navigation', undefined, updated.galleryId, { beaconId, locationName: updated.name });
  };

  const toggleFavorite = (exhibitId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(exhibitId);
      const updated = exists ? prev.filter(id => id !== exhibitId) : [...prev, exhibitId];
      localStorage.setItem('smart_museum_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (exhibitId: string) => favorites.includes(exhibitId);

  const markVisited = (exhibitId: string) => {
    setVisitedExhibits(prev => {
      if (prev.includes(exhibitId)) return prev;
      const updated = [...prev, exhibitId];
      localStorage.setItem('smart_museum_visited', JSON.stringify(updated));
      return updated;
    });
  };

  const playAudio = (exhibit: Exhibit) => {
    setActiveAudio({ exhibit, isPlaying: true, progress: 0 });
    api.track('audio', exhibit.exhibitId, exhibit.galleryId, { action: 'start', title: exhibit.title });
  };

  const pauseAudio = () => {
    if (activeAudio) {
      setActiveAudio({ ...activeAudio, isPlaying: false });
    }
  };

  const stopAudio = () => {
    setActiveAudio(null);
  };

  const toggleAudio = (exhibit: Exhibit) => {
    if (activeAudio?.exhibit?.exhibitId === exhibit.exhibitId && activeAudio.isPlaying) {
      pauseAudio();
    } else {
      playAudio(exhibit);
    }
  };

  const t = (key: string) => translationService.t(key);

  return (
    <VisitorContext.Provider value={{
      language,
      setLanguage,
      currentLocation,
      setBeacon,
      favorites,
      toggleFavorite,
      isFavorite,
      visitedExhibits,
      markVisited,
      t,
      activeAudio,
      playAudio,
      pauseAudio,
      stopAudio,
      toggleAudio
    }}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error('useVisitor must be used within VisitorProvider');
  return ctx;
};

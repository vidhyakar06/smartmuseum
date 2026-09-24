import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Volume2, VolumeX, RotateCcw, FastForward, Rewind, Headphones, Radio, Volume1 } from 'lucide-react';
import { useVisitor } from '../contexts/VisitorContext.js';
import { audioService, AudioPlaybackState } from '../services/audioService.js';

function getLocalizedNarration(exhibit: any, language: string): string {
  const localized = exhibit.translations?.[language];
  const title = localized?.title || exhibit.title;
  const description = localized?.description || exhibit.description;

  switch (language) {
    case 'ta':
      return `${title}. கலைஞர் ${exhibit.artist}, ஆண்டு ${exhibit.year}. ${description}`;
    case 'hi':
      return `${title}। महान कलाकार ${exhibit.artist}, रचना काल ${exhibit.year}। ${description}`;
    case 'fr':
      return `${title}. Une œuvre de ${exhibit.artist}, ${exhibit.year}. ${description}`;
    case 'de':
      return `${title}. Ein Werk von ${exhibit.artist}, ${exhibit.year}. ${description}`;
    case 'es':
      return `${title}. Obra maestra de ${exhibit.artist}, ${exhibit.year}. ${description}`;
    case 'ml':
      return `${title}. കലാകാരൻ ${exhibit.artist}, വർഷം ${exhibit.year}. ${description}`;
    case 'te':
      return `${title}. కళాకారుడు ${exhibit.artist}, సంవత్సరం ${exhibit.year}. ${description}`;
    case 'kn':
      return `${title}. ಕಲಾವಿದ ${exhibit.artist}, ವರ್ಷ ${exhibit.year}. ${description}`;
    case 'en':
    default:
      return `${title}. By ${exhibit.artist}, ${exhibit.year}. ${description}${exhibit.longDescription ? ' ' + exhibit.longDescription : ''}`;
  }
}

export const AudioPlayer: React.FC = () => {
  const { activeAudio, pauseAudio, stopAudio, language } = useVisitor();
  const exhibit = activeAudio?.exhibit;

  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(audioService.getState());
  const [showCaptions, setShowCaptions] = useState(true);

  // Subscribe to real-time audio service updates
  useEffect(() => {
    const unsubscribe = audioService.subscribe((newState) => {
      setPlaybackState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // When exhibit or language changes, trigger narration
  useEffect(() => {
    if (exhibit && activeAudio?.isPlaying) {
      const textToSpeak = getLocalizedNarration(exhibit, language);
      const durationOverride = exhibit.audioDuration || 140;

      audioService.playNarration(textToSpeak, language, durationOverride);
    } else if (!activeAudio?.isPlaying) {
      audioService.pause();
    }

    return () => {
      // Don't fully stop on every render, only when exhibit changes
    };
  }, [exhibit?.exhibitId, language]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      audioService.stop(false);
    };
  }, []);

  const handleTogglePlay = () => {
    if (playbackState.isPlaying && !playbackState.isPaused) {
      audioService.pause();
    } else if (playbackState.isPaused) {
      audioService.resume();
    } else if (exhibit) {
      const textToSpeak = getLocalizedNarration(exhibit, language);
      audioService.playNarration(textToSpeak, language, exhibit.audioDuration || 140);
    }
  };

  const handleClose = () => {
    audioService.stop(true);
    stopAudio();
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    audioService.seekPercentage(val);
  };

  const handleFastForward = () => {
    audioService.seek(playbackState.currentTime + 15);
  };

  const handleRewind = () => {
    audioService.seek(playbackState.currentTime - 15);
  };

  const handleRestart = () => {
    audioService.seek(0);
  };

  const cycleRate = () => {
    const rates = [1.0, 1.25, 1.5, 0.85];
    const currentIdx = rates.indexOf(playbackState.playbackRate);
    const nextRate = rates[(currentIdx + 1) % rates.length];
    audioService.setRate(nextRate);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!exhibit) return null;

  const isActuallyPlaying = playbackState.isPlaying && !playbackState.isPaused;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 max-w-xl mx-auto z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="glass-panel-glow rounded-2xl p-4 shadow-2xl border border-museum-gold/40 bg-[#12151B]/95 backdrop-blur-xl text-museum-text">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Artwork Thumbnail with Live Wave Badge */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-museum-elevated flex-shrink-0 border border-museum-gold/30 relative group shadow-md">
              <img src={exhibit.images[0]} alt={exhibit.title} className="w-full h-full object-cover" />
              {isActuallyPlaying && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-0.5 px-1">
                  <span className="w-1 h-4 bg-museum-gold rounded-full animate-pulse" style={{ animationDuration: '0.6s' }} />
                  <span className="w-1 h-6 bg-museum-cyan rounded-full animate-pulse" style={{ animationDuration: '0.4s' }} />
                  <span className="w-1 h-3 bg-museum-gold rounded-full animate-pulse" style={{ animationDuration: '0.8s' }} />
                  <span className="w-1 h-5 bg-museum-gold-light rounded-full animate-pulse" style={{ animationDuration: '0.5s' }} />
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-museum-gold font-bold uppercase tracking-wider text-[10px] bg-museum-gold/15 px-2 py-0.5 rounded-full border border-museum-gold/30">
                  <Headphones size={11} className={isActuallyPlaying ? 'animate-bounce' : ''} />
                  Official Audio Guide
                </span>
                {playbackState.voiceName && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-museum-muted font-mono truncate max-w-[140px]" title={playbackState.voiceName}>
                    <Radio size={9} className="text-museum-cyan flex-shrink-0" />
                    {playbackState.voiceName.split(' ')[0]} Voice
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold truncate text-white mt-0.5">{exhibit.title}</h4>
              <p className="text-xs text-museum-muted truncate">{exhibit.artist} • {exhibit.year}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCaptions(prev => !prev)}
              className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-colors ${
                showCaptions
                  ? 'bg-museum-cyan/15 text-museum-cyan border-museum-cyan/40'
                  : 'text-museum-muted hover:text-white border-transparent bg-white/5'
              }`}
              title="Toggle Live Curatorial Subtitles"
            >
              CC
            </button>
            <button
              onClick={handleClose}
              className="text-museum-muted hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Close Audio Guide"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Audio Narration Subtitles / Captions */}
        {showCaptions && playbackState.currentSentence && (
          <div className="mb-2.5 p-2 rounded-xl bg-[#191D26] border border-museum-border/70 text-xs text-museum-text font-serif leading-relaxed line-clamp-2 italic transition-all flex items-start gap-2">
            <span className="text-museum-gold text-sm font-sans font-bold flex-shrink-0">“</span>
            <span className="flex-1 text-gray-200">{playbackState.currentSentence}</span>
            <span className="text-museum-gold text-sm font-sans font-bold flex-shrink-0">”</span>
          </div>
        )}

        {/* Seek Bar & Live Waveform Animation */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={playbackState.progress}
              onChange={handleSeekChange}
              className="w-full h-2 bg-museum-elevated rounded-lg cursor-pointer accent-museum-gold transition-all"
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-museum-muted font-mono px-0.5">
            <span className="font-semibold text-museum-gold">
              {formatSeconds(playbackState.currentTime)}
            </span>
            <div className="flex items-center gap-1.5">
              {isActuallyPlaying && (
                <span className="flex items-center gap-1 text-[10px] text-museum-cyan uppercase font-sans tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-museum-cyan animate-ping" />
                  Narrating ({language.toUpperCase()})
                </span>
              )}
            </div>
            <span>{formatSeconds(playbackState.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-museum-border/40">
          {/* Left: Volume & Speed Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => audioService.toggleMute()}
              className="text-museum-muted hover:text-white p-1.5 rounded-lg hover:bg-museum-elevated transition-colors"
              title={playbackState.isMuted ? 'Unmute' : 'Mute'}
            >
              {playbackState.isMuted ? (
                <VolumeX size={16} className="text-red-400" />
              ) : playbackState.isPlaying ? (
                <Volume2 size={16} className="text-museum-gold" />
              ) : (
                <Volume1 size={16} />
              )}
            </button>
            <button
              onClick={cycleRate}
              className="text-xs px-2 py-0.5 rounded-lg bg-museum-elevated text-museum-muted hover:text-white hover:border-museum-gold/40 border border-museum-border font-mono font-medium transition-all"
              title="Change Speech Speed"
            >
              {playbackState.playbackRate}x
            </button>
          </div>

          {/* Center: Audio Transport Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRestart}
              className="text-museum-muted hover:text-white p-1.5 rounded-full hover:bg-museum-elevated transition-colors"
              title="Restart from Beginning"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={handleRewind}
              className="text-museum-muted hover:text-white p-1.5 rounded-full hover:bg-museum-elevated transition-colors"
              title="Rewind 15s"
            >
              <Rewind size={16} />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-museum-gold to-museum-gold-light text-black flex items-center justify-center font-bold shadow-lg shadow-museum-gold/30 hover:scale-105 active:scale-95 transition-all"
              title={isActuallyPlaying ? 'Pause Narration' : 'Play Audio Guide'}
            >
              {isActuallyPlaying ? (
                <Pause size={20} fill="black" />
              ) : (
                <Play size={20} fill="black" className="ml-0.5" />
              )}
            </button>

            <button
              onClick={handleFastForward}
              className="text-museum-muted hover:text-white p-1.5 rounded-full hover:bg-museum-elevated transition-colors"
              title="Fast Forward 15s"
            >
              <FastForward size={16} />
            </button>
          </div>

          {/* Right: Gallery Indicator */}
          <div className="text-[11px] text-museum-gold border border-museum-gold/30 rounded-lg px-2 py-1 bg-museum-gold/10 font-mono font-medium">
            {exhibit.galleryId ? `Gal ${exhibit.galleryId.replace('GAL_', '')}` : 'Gallery'}
          </div>
        </div>
      </div>
    </div>
  );
};

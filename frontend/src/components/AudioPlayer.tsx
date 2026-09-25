import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  FastForward,
  Rewind,
  Headphones,
  Radio,
  Volume1,
  ChevronUp,
  ChevronDown,
  Info,
  Sparkles,
  Palette
} from 'lucide-react';
import { useVisitor } from '../contexts/VisitorContext.js';
import { audioService, AudioPlaybackState } from '../services/audioService.js';

export function getComprehensiveNarration(exhibit: any, language: string): string {
  const localized = exhibit.translations?.[language];
  const title = localized?.title || exhibit.title;
  const description = localized?.description || exhibit.description;
  const category = localized?.category || exhibit.category || 'Fine Art';
  const artist = exhibit.artist;
  const year = exhibit.year;
  const medium = exhibit.medium || 'Oil on canvas';
  const dimensions = exhibit.dimensions ? `, measuring ${exhibit.dimensions}` : '';
  const location = exhibit.location ? ` This masterpiece is on display in ${exhibit.location}.` : '';
  const longDesc = exhibit.longDescription ? ` ${exhibit.longDescription}` : '';
  const curatorNotes = exhibit.curatorNotes ? ` Curatorial analysis notes: ${exhibit.curatorNotes}` : '';

  switch (language) {
    case 'ta':
      return `வணக்கம். நீங்கள் தற்போது பார்வையிடும் வரலாற்று சிறப்புமிக்க ஓவியம்: ${title}. இதை படைத்தவர் புகழ்பெற்ற மேதை ${artist}, ஆண்டு ${year}. இப்படைப்பு ${category} கலை பாணியைச் சேர்ந்தது. ஊடகம்: ${medium}${exhibit.dimensions ? `, அளவு: ${exhibit.dimensions}` : ''}.${location ? ` இது அருங்காட்சியகத்தின் ${exhibit.location} பிரிவில் காட்சிப்படுத்தப்பட்டுள்ளது.` : ''} ${description}${longDesc} ${curatorNotes ? `தலைமை கண்காணிப்பாளரின் ஆய்வு குறிப்பு: ${exhibit.curatorNotes}` : ''} இந்த தலைசிறந்த கலைப்படைப்பின் நுணுக்கங்களையும் வண்ண அமைப்பையும் நிதானமாக உற்றுநோக்குங்கள்.`;

    case 'hi':
      return `नमस्ते। आप वर्तमान में देख रहे हैं विश्वप्रसिद्ध पेंटिंग: ${title}। इसके रचयिता महान कलाकार ${artist} हैं, रचना वर्ष ${year}। यह कृति ${category} आंदोलन का प्रतिनिधित्व करती है। माध्यम: ${medium}${exhibit.dimensions ? `, आयाम: ${exhibit.dimensions}` : ''}।${location ? ` यह कलाकृति ${exhibit.location} में प्रदर्शित है।` : ''} ${description}${longDesc} ${curatorNotes ? `संग्रहालय क्यूरेटर की विशेष टिप्पणी: ${exhibit.curatorNotes}` : ''} कृपया इस ऐतिहासिक कृति के रंगों, प्रकाश और सूक्ष्म विवरणों का ध्यानपूर्वक अवलोकन करें।`;

    case 'fr':
      return `Bienvenue devant le chef-d'œuvre ${title}, peint par ${artist} en ${year}. Cette toile majeure appartient au courant ${category}. Technique : ${medium}${dimensions}.${location ? ` Elle est exposée dans ${exhibit.location}.` : ''} ${description}${longDesc} ${curatorNotes ? `Note du conservateur : ${exhibit.curatorNotes}` : ''} Prenez le temps de contempler la maîtrise technique et la richesse des détails de cette œuvre.`;

    case 'es':
      return `Bienvenidos a la contemplación de la obra maestra ${title}, creada por el maestro ${artist} en el año ${year}. Esta emblemática pieza pertenece a la corriente ${category}. Técnica: ${medium}${dimensions}.${location ? ` Se encuentra expuesta en ${exhibit.location}.` : ''} ${description}${longDesc} ${curatorNotes ? `Notas curatoriales: ${exhibit.curatorNotes}` : ''} Le invitamos a apreciar la armonía de la luz, el color y la maestría de sus pinceladas.`;

    case 'de':
      return `Willkommen bei dem Meisterwerk ${title}, geschaffen von ${artist} im Jahr ${year}. Dieses Werk zählt zur Epoche ${category}. Technik: ${medium}${dimensions}.${location ? ` Ausgestellt in ${exhibit.location}.` : ''} ${description}${longDesc} ${curatorNotes ? `Kuratorenhinweis: ${exhibit.curatorNotes}` : ''} Nehmen Sie sich einen Moment, um die Tiefe, Farbharmonie und die feinen Details dieses Gemäldes zu betrachten.`;

    case 'ml':
      return `നമസ്കാരം. നിങ്ങൾ ഇപ്പോൾ കാണുന്നത് വിശ്വപ്രസിദ്ധമായ ${title} എന്ന പെയിന്റിംഗാണ്. കലാകാരൻ ${artist}, പൂർത്തിയായ വർഷം ${year}. ഈ ചിത്രം ${category} ശൈലിയിലാണ് നിർമ്മിച്ചിരിക്കുന്നത്. മാധ്യമം: ${medium}.${location ? ` പ്രദർശിപ്പിച്ചിരിക്കുന്നത് ${exhibit.location}.` : ''} ${description}${longDesc} ${curatorNotes ? `ക്യൂറേറ്റർ വിവരണം: ${exhibit.curatorNotes}` : ''} ഇതിന്റെ സൂക്ഷ്മമായ വർണ്ണവിന്യാസവും കലാനൈപുണ്യവും ശ്രദ്ധിക്കുക.`;

    case 'te':
      return `నమస్కారం. మీరు వీక్షిస్తున్న అద్భుతమైన కళాఖండం ${title}. చిత్రకారుడు ${artist}, సమర్పించిన సంవత్సరం ${year}. ఇది ${category} కళా శైలికి చెందినది. మాధ్యమం: ${medium}.${location ? ` ఇది ${exhibit.location} వద్ద ప్రదర్శించబడింది.` : ''} ${description}${longDesc} ${curatorNotes ? `క్యూరేటర్ పరిశీలన: ${exhibit.curatorNotes}` : ''} ఈ పెయింటింగ్ యొక్క విశిష్ట రంగులు మరియు నైపుణ్యాన్ని ఆస్వాదించండి.`;

    case 'kn':
      return `ನಮಸ್ಕಾರ. ನೀವು ವೀಕ್ಷಿಸುತ್ತಿರುವ ಅದ್ಭುತ ಚಿತ್ರಕಲೆ ${title}. ಕಲಾವಿದ ${artist}, ರಚನೆಯಾದ ವರ್ಷ ${year}. ಈ ಕಲಾಕೃತಿ ${category} ಶೈಲಿಗೆ ಸೇರಿದೆ. ಮಾಧ್ಯಮ: ${medium}.${location ? ` ಇದು ${exhibit.location} ದಲ್ಲಿ ಪ್ರದರ್ಶನಗೊಂಡಿದೆ.` : ''} ${description}${longDesc} ${curatorNotes ? `ಕ್ಯುರೇಟರ್ ಟಿಪ್ಪಣಿ: ${exhibit.curatorNotes}` : ''} ಈ ಕಲಾಕೃತಿಯ ಸೂಕ್ಷ್ಮ ರೇಖೆಗಳು ಮತ್ತು ವರ್ಣ ಸಂಯೋಜನೆಯನ್ನು ಗಮನಿಸಿ.`;

    case 'en':
    default:
      return `Welcome to this official audio tour for ${title}, painted by master artist ${artist} in ${year}. This landmark work is celebrated under the ${category} movement and is executed in ${medium}${dimensions}.${location} ${description}${longDesc}${curatorNotes} We invite you to pause and examine the brushwork, the balance of light and shadow, and the lasting emotion captured in this extraordinary painting.`;
  }
}

export const AudioPlayer: React.FC = () => {
  const { activeAudio, pauseAudio, stopAudio, language } = useVisitor();
  const exhibit = activeAudio?.exhibit;

  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(audioService.getState());
  const [showCaptions, setShowCaptions] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Subscribe to real-time audio service updates
  useEffect(() => {
    const unsubscribe = audioService.subscribe((newState) => {
      setPlaybackState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // When exhibit or language changes, trigger narration with full painting details
  useEffect(() => {
    if (exhibit && activeAudio?.isPlaying) {
      const textToSpeak = getComprehensiveNarration(exhibit, language);
      const durationOverride = exhibit.audioDuration || 140;

      audioService.playNarration(textToSpeak, language, durationOverride);
    } else if (!activeAudio?.isPlaying) {
      audioService.pause();
    }
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
      const textToSpeak = getComprehensiveNarration(exhibit, language);
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
  const fullText = getComprehensiveNarration(exhibit, language);

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
                  Curated Audio Guide
                </span>
                {playbackState.voiceName && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-museum-muted font-mono truncate max-w-[140px]" title={playbackState.voiceName}>
                    <Radio size={9} className="text-museum-cyan flex-shrink-0" />
                    {playbackState.voiceName.split(' ')[0]} Voice
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold truncate text-white mt-0.5">{exhibit.title}</h4>
              <p className="text-xs text-museum-muted truncate">
                {exhibit.artist} • {exhibit.year} • <span className="text-museum-gold/90">{exhibit.category}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Full Details Drawer */}
            <button
              onClick={() => setShowDetails(prev => !prev)}
              className={`text-[10px] font-medium px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                showDetails
                  ? 'bg-museum-gold text-black font-bold border-museum-gold shadow-sm'
                  : 'text-museum-gold bg-museum-gold/10 hover:bg-museum-gold/20 border-museum-gold/30'
              }`}
              title="View In-Depth Painting Dossier & Spoken Script"
            >
              <Info size={11} />
              <span>Details</span>
              {showDetails ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
            </button>

            {/* Subtitles Toggle */}
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
        {showCaptions && !showDetails && playbackState.currentSentence && (
          <div className="mb-2.5 p-2 rounded-xl bg-[#191D26] border border-museum-border/70 text-xs text-museum-text font-serif leading-relaxed line-clamp-2 italic transition-all flex items-start gap-2">
            <span className="text-museum-gold text-sm font-sans font-bold flex-shrink-0">“</span>
            <span className="flex-1 text-gray-200">{playbackState.currentSentence}</span>
            <span className="text-museum-gold text-sm font-sans font-bold flex-shrink-0">”</span>
          </div>
        )}

        {/* Expandable Painting Details Dossier & Full Spoken Script */}
        {showDetails && (
          <div className="mb-3 p-3 rounded-xl bg-[#0F1116] border border-museum-gold/30 space-y-2.5 max-h-56 overflow-y-auto scrollbar-thin text-xs animate-in fade-in duration-200">
            {/* Quick Metadata Matrix */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-museum-border/40">
              <div className="bg-[#151922] p-1.5 rounded-lg border border-museum-border/40">
                <span className="text-museum-muted block text-[10px]">Medium & Technique</span>
                <span className="text-white font-medium truncate block">{exhibit.medium || 'Oil on canvas'}</span>
              </div>
              <div className="bg-[#151922] p-1.5 rounded-lg border border-museum-border/40">
                <span className="text-museum-muted block text-[10px]">Dimensions</span>
                <span className="text-white font-medium truncate block">{exhibit.dimensions || 'Classic format'}</span>
              </div>
              <div className="bg-[#151922] p-1.5 rounded-lg border border-museum-border/40">
                <span className="text-museum-muted block text-[10px]">Art Movement</span>
                <span className="text-museum-gold font-medium truncate block">{exhibit.category}</span>
              </div>
              <div className="bg-[#151922] p-1.5 rounded-lg border border-museum-border/40">
                <span className="text-museum-muted block text-[10px]">Gallery Location</span>
                <span className="text-museum-cyan font-medium truncate block">{exhibit.location}</span>
              </div>
            </div>

            {/* Current Sentence Highlight */}
            {playbackState.currentSentence && (
              <div className="p-2 rounded-lg bg-museum-gold/10 border border-museum-gold/30">
                <div className="flex items-center gap-1.5 text-museum-gold font-bold text-[10px] uppercase tracking-wider mb-1">
                  <Sparkles size={11} />
                  <span>Currently Speaking</span>
                </div>
                <p className="font-serif italic text-white leading-relaxed">
                  "{playbackState.currentSentence}"
                </p>
              </div>
            )}

            {/* Curator's Note */}
            {exhibit.curatorNotes && (
              <div className="p-2 rounded-lg bg-[#181C26] border-l-2 border-museum-cyan text-[11px] text-gray-300">
                <span className="text-museum-cyan font-semibold block text-[10px] uppercase tracking-wider mb-0.5">Chief Curator's Key Insight</span>
                {exhibit.curatorNotes}
              </div>
            )}

            {/* Complete Spoken Script */}
            <div>
              <span className="text-museum-muted block text-[10px] uppercase tracking-wider font-semibold mb-1">Full Narration Text</span>
              <p className="text-gray-300 leading-relaxed font-serif text-[11px]">
                {fullText}
              </p>
            </div>
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
                  Explaining Details ({language.toUpperCase()})
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

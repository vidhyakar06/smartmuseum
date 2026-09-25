import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  QrCode,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api.js';
import { Exhibit } from '../types/index.js';
import { useVisitor } from '../contexts/VisitorContext.js';

export const QRScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { markVisited } = useVisitor();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    api.getExhibits().then(res => {
      if (res.success) setExhibits(res.data);
    }).catch(() => {});

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const html5QrCode = new Html5Qrcode('qr-reader', {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false
      });
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleSuccessfulScan(decodedText);
        },
        () => {
          // scanning frame tick
        }
      );

      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera initiation failed:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in browser settings or use the Instant Demo QR codes below.'
          : 'Unable to access camera hardware. You can test all exhibits via the interactive QR chips below.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.error('Error stopping QR scanner', e);
      }
    }
    setCameraActive(false);
  };

  const handleSuccessfulScan = (decodedText: string) => {
    setScannedResult(decodedText);
    stopCamera();

    api.track('qr-scan', undefined, undefined, { raw: decodedText, method: 'camera' });

    // 1. Check if scanned code is an Admission Ticket (e.g. TCK-..., MUSEUM_TICKET:..., /ticket/TCK-...)
    const ticketMatch = decodedText.match(/TCK-[\w-]+/i) || decodedText.match(/MUSEUM_TICKET:([^\s:]+)/i);
    if (ticketMatch || decodedText.includes('/ticket/')) {
      const ticketId = ticketMatch
        ? (ticketMatch[1] || ticketMatch[0])
        : decodedText.split('/ticket/')[1]?.split(/[?#]/)[0];

      if (ticketId) {
        setScannedResult(`Verified Admission Ticket: ${ticketId}`);
        setTimeout(() => {
          navigate(`/ticket/${ticketId}`);
        }, 500);
        return;
      }
    }

    // 2. Check if scanned code is an Exhibit ID or Exhibit URL (e.g. EX001 or /exhibit/EX001)
    const match = decodedText.match(/EX\d{3}/i) || (decodedText.includes('/exhibit/') ? [decodedText.split('/exhibit/')[1]?.split(/[?#]/)[0]] : null);
    if (match && match[0]) {
      const exId = match[0].toUpperCase();
      markVisited(exId);
      setTimeout(() => {
        navigate(`/exhibit/${exId}`);
      }, 500);
    } else {
      setCameraError(`Scanned code "${decodedText}" is not recognized as a valid museum exhibit or admission ticket.`);
    }
  };

  const handleQuickDemoClick = (exhibitId: string) => {
    markVisited(exhibitId);
    api.track('qr-scan', exhibitId, undefined, { method: 'demo-quick-click' });
    navigate(`/exhibit/${exhibitId}`);
  };

  const handleQuickTicketClick = (ticketId: string) => {
    api.track('qr-scan', undefined, undefined, { raw: ticketId, method: 'ticket-quick-click' });
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-museum-gold/10 border border-museum-gold/30 text-museum-gold text-xs font-semibold mb-3">
          <QrCode size={13} />
          <span>Zero-Install Camera Reader</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Scan Exhibit QR Code</h1>
        <p className="text-sm text-museum-muted">
          Point your device camera at any artwork plaque or gallery checkpoint to instantly load audio guides and AI expert insights.
        </p>
      </div>

      {/* Main Scanner Card */}
      <div className="glass-panel-glow rounded-3xl p-6 border border-museum-gold/30 shadow-2xl overflow-hidden max-w-md mx-auto">
        <div className="relative aspect-square rounded-2xl bg-[#090B0E] border border-museum-border overflow-hidden flex items-center justify-center">
          {/* HTML5 QR Container */}
          <div id="qr-reader" className="w-full h-full" />

          {/* Scanner Overlay Guide Frame when active */}
          {cameraActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-60 h-60 border-2 border-museum-gold rounded-2xl relative animate-pulse shadow-gold-glow">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-museum-gold -mt-1 -ml-1" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-museum-gold -mt-1 -mr-1" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-museum-gold -mb-1 -ml-1" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-museum-gold -mb-1 -mr-1" />
              </div>
            </div>
          )}

          {/* Fallback Display before camera start */}
          {!cameraActive && (
            <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#15181D] to-[#0D0F13]">
              <div className="w-16 h-16 rounded-2xl bg-museum-gold/10 border border-museum-gold/30 flex items-center justify-center text-museum-gold mb-4 shadow-gold-glow/20">
                <Camera size={32} />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Waiting for Camera Access</h3>
              <p className="text-xs text-museum-muted max-w-xs mb-6">
                Tap the button below to activate device optical sensor for contactless art interaction.
              </p>
              <button
                onClick={startCamera}
                className="px-6 py-3 rounded-xl bg-museum-gold text-black font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-museum-gold/20 flex items-center gap-2"
              >
                <Camera size={16} />
                <span>Launch QR Scanner</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Controls below scanner */}
        <div className="mt-4 flex items-center justify-between text-xs">
          {cameraActive ? (
            <button
              onClick={stopCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900/60 transition-colors"
            >
              <CameraOff size={14} />
              <span>Stop Camera</span>
            </button>
          ) : (
            <span className="text-museum-muted font-mono text-[11px]">Status: Idle</span>
          )}

          <span className="text-[11px] text-museum-gold font-medium">Supports QR v1–v40</span>
        </div>

        {/* Error Notification */}
        {cameraError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-white mb-0.5">Camera Notice</p>
              <p className="text-[11px] leading-relaxed text-amber-200/90">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Scanned Result Banner */}
        {scannedResult && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span className="truncate">Scanned: <strong>{scannedResult}</strong></span>
          </div>
        )}
      </div>

      {/* Instant Demo QR Trigger Bar */}
      <div className="bg-[#15181D] border border-museum-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-museum-gold" />
              Instant Exhibit QR Checkpoints (Presentation Mode)
            </h3>
            <p className="text-xs text-museum-muted">
              Click any exhibit below to instantly simulate scanning its physical museum plaque.
            </p>
          </div>
          <span className="text-[11px] font-mono text-museum-cyan px-2.5 py-1 rounded bg-museum-elevated border border-museum-cyan/30">
            BYOD Simulated Scan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Demo Ticket Scan Chip */}
          <button
            onClick={() => handleQuickTicketClick('TCK-20260925-1284')}
            className="p-3 rounded-xl bg-gradient-to-tr from-yellow-950/40 to-yellow-900/20 hover:bg-yellow-900/40 border border-museum-gold/50 text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-museum-gold text-black font-bold">
                TICKET
              </span>
              <QrCode size={13} className="text-museum-gold group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-semibold text-museum-gold group-hover:text-yellow-300 transition-colors line-clamp-1">
              Admission Pass
            </div>
            <div className="text-[10px] text-museum-muted truncate mt-0.5">
              Vicky (TCK-20260925-1284)
            </div>
          </button>

          {exhibits.map(ex => (
            <button
              key={ex.exhibitId}
              onClick={() => handleQuickDemoClick(ex.exhibitId)}
              className="p-3 rounded-xl bg-museum-elevated/70 hover:bg-museum-elevated border border-museum-border hover:border-museum-gold/40 text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-museum-gold border border-museum-gold/20">
                  {ex.exhibitId}
                </span>
                <QrCode size={13} className="text-museum-muted group-hover:text-museum-gold transition-colors" />
              </div>
              <div className="text-xs font-semibold text-white group-hover:text-museum-gold transition-colors line-clamp-1">
                {ex.title}
              </div>
              <div className="text-[10px] text-museum-muted truncate mt-0.5">
                {ex.artist}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

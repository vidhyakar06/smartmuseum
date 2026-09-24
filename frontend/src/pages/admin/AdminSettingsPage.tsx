import React, { useState } from 'react';
import { Settings, Database, Bot, Radio, Clock, RotateCcw, CheckCircle2, Shield } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    if (confirm('Reset museum demo telemetry, visitors, and occupancy to factory baseline?')) {
      localStorage.removeItem('smart_museum_favorites');
      localStorage.removeItem('smart_museum_visited');
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">
          Cloud Infrastructure & Integrations
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          System Configuration & Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database & Cloud Mode */}
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-museum-border">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Database Store Status</h3>
              <p className="text-xs text-museum-muted font-mono">Dual-Engine Architecture</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-museum-elevated border border-museum-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Active Store</p>
                <p className="text-museum-muted text-[11px]">In-Memory Museum Collections (Demo Mode)</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px]">
                ACTIVE
              </span>
            </div>

            <p className="text-museum-muted text-[11px] leading-relaxed">
              To connect to production MongoDB Atlas, specify <code className="text-museum-gold">MONGODB_URI</code> in <code className="text-museum-gold">.env</code>. The application automatically falls back without disruption.
            </p>
          </div>
        </div>

        {/* AI Model Configuration */}
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-museum-border">
            <div className="w-8 h-8 rounded-lg bg-museum-cyan/20 text-museum-cyan flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Art Historian Service</h3>
              <p className="text-xs text-museum-muted font-mono">Groq LLaMA 3.3</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-museum-elevated border border-museum-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">AI Engine</p>
                <p className="text-museum-muted text-[11px]">Autonomous Museum Knowledge Fallback</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-museum-cyan/15 text-museum-cyan font-mono text-[10px]">
                READY
              </span>
            </div>

            <p className="text-museum-muted text-[11px] leading-relaxed">
              Add <code className="text-museum-gold">GROQ_API_KEY</code> to enable live ultra-fast cloud LLaMA 3.3 inference with custom system curatorial prompt.
            </p>
          </div>
        </div>

        {/* Indoor BLE Beacon Settings */}
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-museum-border">
            <div className="w-8 h-8 rounded-lg bg-museum-gold/20 text-museum-gold flex items-center justify-center">
              <Radio size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Micro-Location Telemetry</h3>
              <p className="text-xs text-museum-muted font-mono">iBeacon / Eddystone Protocol</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-museum-border/40">
              <span className="text-museum-muted">RSSI Proximity Distance</span>
              <span className="text-white font-mono">Immediate (&lt; 1.5m)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-museum-border/40">
              <span className="text-museum-muted">Active Zone Gateways</span>
              <span className="text-white font-mono">6 Transmitters</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-museum-muted">Bottleneck Auto-Reroute</span>
              <span className="text-emerald-400 font-semibold">Enabled (Threshold: 100%)</span>
            </div>
          </div>
        </div>

        {/* Demo Telemetry Reset Card */}
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-museum-border">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <RotateCcw size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Presentation Reset</h3>
                <p className="text-xs text-museum-muted font-mono">Clean Slate for Demonstrations</p>
              </div>
            </div>

            <p className="text-xs text-museum-muted mt-3 leading-relaxed">
              Reset all client sessions, scanned test QR tags, favorited works, and audio tracking for fresh college project demonstration.
            </p>
          </div>

          <div>
            {resetSuccess && (
              <p className="text-xs text-emerald-400 mb-2 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>Demo environment reset successfully!</span>
              </p>
            )}
            <button
              onClick={handleResetData}
              className="w-full py-2.5 bg-museum-elevated hover:bg-museum-border border border-museum-border text-museum-gold font-bold text-xs rounded-xl transition-colors"
            >
              Reset Demo Telemetry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

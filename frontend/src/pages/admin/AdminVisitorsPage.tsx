import React, { useState, useEffect } from 'react';
import { Users, Smartphone, MapPin, Globe, Clock, Shield } from 'lucide-react';

export const AdminVisitorsPage: React.FC = () => {
  const [visitors, setVisitors] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/visitors')
      .then(res => res.json())
      .then(res => {
        if (res.success) setVisitors(res.data);
      }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">
          Active BYOD Smart Device Connections
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Live Visitor Sessions
        </h1>
        <p className="text-xs text-museum-muted mt-1">
          Zero-install smartphone sessions currently connected to indoor BLE beacons and AI services.
        </p>
      </div>

      <div className="bg-[#15181D] border border-museum-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-museum-border text-museum-muted font-mono uppercase text-[10px] bg-[#11141A]">
                <th className="p-4">Session ID</th>
                <th className="p-4">Current Zone / Beacon</th>
                <th className="p-4">Language</th>
                <th className="p-4">Client Device</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Bookmarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-museum-border/40">
              {visitors.map(v => (
                <tr key={v.id} className="hover:bg-museum-elevated/40 transition-colors">
                  <td className="p-4 font-mono text-museum-gold text-[11px] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{v.sessionId}</span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-white font-medium">
                      <MapPin size={13} className="text-museum-cyan" />
                      <span>{v.currentLocation}</span>
                    </span>
                    <span className="text-[10px] font-mono text-museum-muted block mt-0.5">{v.currentBeaconId || 'BEACON_ENTRANCE'}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded uppercase font-mono text-[10px] bg-museum-elevated border border-museum-border text-museum-gold">
                      {v.language}
                    </span>
                  </td>
                  <td className="p-4 text-museum-muted font-mono text-[11px]">{v.deviceInfo || 'Mobile Browser'}</td>
                  <td className="p-4 text-museum-text font-mono text-[11px]">~25 mins</td>
                  <td className="p-4 font-mono text-museum-gold">{v.favorites?.length || 0} works</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

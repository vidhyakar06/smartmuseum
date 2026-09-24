import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Headphones, Sparkles, QrCode, Globe, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { api } from '../../services/api.js';
import { DashboardData } from '../../types/index.js';

export const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.getDashboard().then(res => {
      if (res.success) setData(res.data);
    }).catch(() => {});
  }, []);

  const dwellData = [
    { gallery: 'Gallery A', minutes: 24, artworks: 3 },
    { gallery: 'Gallery B', minutes: 31, artworks: 3 },
    { gallery: 'Gallery C', minutes: 19, artworks: 2 },
    { gallery: 'Gallery D', minutes: 15, artworks: 2 },
    { gallery: 'Gallery E', minutes: 18, artworks: 2 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">
          Visitor Behavior & Curatorial Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Deep Visitor Analytics
        </h1>
        <p className="text-xs text-museum-muted mt-1">
          Scholarly engagement metrics, dwell durations, audio completion, and AI query patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dwell Time per Gallery */}
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Average Dwell Time per Gallery</h3>
              <p className="text-xs text-museum-muted">Minutes spent exploring curatorial zones</p>
            </div>
            <Clock size={16} className="text-museum-gold" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dwellData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252A34" />
                <XAxis dataKey="gallery" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#15181D', borderColor: '#2A303C', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="minutes" name="Average Minutes" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audio Guide Engagement & Completion */}
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Audio Guide Retention Rate</h3>
              <p className="text-xs text-museum-muted">Completion rate by artwork track</p>
            </div>
            <Headphones size={16} className="text-purple-400" />
          </div>

          <div className="space-y-4 pt-2">
            {[
              { title: 'The Starry Night (EX002)', rate: 94, plays: 280 },
              { title: 'Mona Lisa (EX001)', rate: 89, plays: 310 },
              { title: 'Pietà (EX006)', rate: 84, plays: 165 },
              { title: 'Guernica (EX008)', rate: 78, plays: 140 },
              { title: 'Persistence of Memory (EX003)', rate: 75, plays: 195 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white font-medium">{item.title}</span>
                  <span className="text-museum-gold font-mono">{item.rate}% ({item.plays} plays)</span>
                </div>
                <div className="w-full h-2 bg-museum-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-museum-gold to-museum-cyan rounded-full" style={{ width: `${item.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

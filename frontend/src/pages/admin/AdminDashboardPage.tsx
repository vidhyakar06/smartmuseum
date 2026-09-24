import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  QrCode,
  Sparkles,
  Headphones,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Building2,
  Globe,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../../services/api.js';
import { DashboardData } from '../../types/index.js';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    setLoading(true);
    api.getDashboard().then(res => {
      if (res.success) setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
    const timer = setInterval(fetchDashboard, 30000); // 30s auto-refresh
    return () => clearInterval(timer);
  }, []);

  if (loading && !data) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-museum-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-museum-muted text-xs font-mono">Aggregating real-time visitor telemetry...</p>
      </div>
    );
  }

  const COLORS = ['#D4AF37', '#38BDF8', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#64748B'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">
            Cloud Operations & Sensor Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Museum Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-museum-elevated hover:bg-museum-border text-xs text-museum-muted hover:text-white border border-museum-border transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {/* Real-Time Bottleneck Warning Banner */}
      {data?.summary.crowdBottleneckAlert && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Active Crowd Bottleneck Detected</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500 text-white font-mono">CRITICAL</span>
              </h4>
              <p className="text-xs text-red-200 mt-0.5">
                {data.summary.crowdBottleneckAlert.message}
              </p>
            </div>
          </div>

          <div className="text-xs text-right">
            <span className="text-museum-muted block">Automated Action:</span>
            <span className="text-museum-gold font-medium">Dynamic re-routing prompt active on visitor maps</span>
          </div>
        </div>
      )}

      {/* 6 Core KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-museum-muted mb-2">
            <span className="text-xs font-semibold">Total Visitors</span>
            <Users size={16} className="text-museum-cyan" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{data?.summary.totalVisitors}</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              <span>+14% today</span>
            </div>
          </div>
        </div>

        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-museum-muted mb-2">
            <span className="text-xs font-semibold">Live in Museum</span>
            <Eye size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{data?.summary.liveVisitors}</div>
            <div className="text-[11px] text-museum-muted mt-1 font-mono">Sensors active</div>
          </div>
        </div>

        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-museum-muted mb-2">
            <span className="text-xs font-semibold">Today's QR Scans</span>
            <QrCode size={16} className="text-museum-gold" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{data?.summary.qrScans}</div>
            <div className="text-[11px] text-museum-gold mt-1">Zero-install BYOD</div>
          </div>
        </div>

        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-museum-muted mb-2">
            <span className="text-xs font-semibold">AI Art Q&A</span>
            <Sparkles size={16} className="text-museum-cyan" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{data?.summary.aiQuestions}</div>
            <div className="text-[11px] text-museum-cyan mt-1 font-mono">Groq LLaMA</div>
          </div>
        </div>

        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-museum-muted mb-2">
            <span className="text-xs font-semibold">Audio Streams</span>
            <Headphones size={16} className="text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{data?.summary.audioPlays}</div>
            <div className="text-[11px] text-purple-300 mt-1">84% completion</div>
          </div>
        </div>

        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-museum-muted mb-2">
            <span className="text-xs font-semibold">Top Artwork</span>
            <ArrowUpRight size={16} className="text-museum-gold" />
          </div>
          <div>
            <div className="text-base font-bold text-white truncate font-serif">{data?.summary.mostPopularExhibit}</div>
            <div className="text-[11px] text-museum-gold mt-1 truncate">Gallery A • 340 views</div>
          </div>
        </div>
      </div>

      {/* Main Charts Row 1: Hourly Traffic + Gallery Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visitors by Hour Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[#15181D] border border-museum-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Visitor Footfall & AI Interactions by Hour</h3>
              <p className="text-xs text-museum-muted">Synchronized telemetry between physical entry and digital queries</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.hourlyTraffic || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252A34" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#15181D', borderColor: '#2A303C', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="visitors" name="Physical Footfall" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#visitorGradient)" />
                <Area type="monotone" dataKey="aiChats" name="AI Art Queries" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#aiGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gallery Occupancy vs Capacity (4 cols) */}
        <div className="lg:col-span-4 bg-[#15181D] border border-museum-border rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Gallery Density & Capacity</h3>
            <p className="text-xs text-museum-muted mb-4">Live threshold monitoring</p>

            <div className="space-y-4">
              {data?.galleryTraffic.map((gal) => (
                <div key={gal.galleryId} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white truncate">{gal.name}</span>
                    <span className={`font-mono text-[11px] ${gal.isBottleneck ? 'text-red-400 font-bold' : 'text-museum-muted'}`}>
                      {gal.current} / {gal.capacity} ({gal.occupancyPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-museum-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        gal.isBottleneck ? 'bg-red-500' : gal.occupancyPercentage > 80 ? 'bg-amber-400' : 'bg-museum-gold'
                      }`}
                      style={{ width: `${Math.min(gal.occupancyPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-museum-border/60 text-[11px] text-museum-muted">
            <span className="text-museum-gold font-semibold">Rerouting policy: </span>
            Auto-divert visitors when zone exceeds 100% capacity threshold.
          </div>
        </div>
      </div>

      {/* Row 2: Most Popular Artworks + Multilingual Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Exhibit Popularity Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#15181D] border border-museum-border rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">Artwork Engagement Leaderboard</h3>
          <p className="text-xs text-museum-muted mb-4">Combined views, QR scans, and audio listen duration</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.popularExhibits || []} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252A34" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="title" type="category" stroke="#64748B" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#15181D', borderColor: '#2A303C', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="views" name="Visitor Interactions" fill="#D4AF37" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Usage Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-[#15181D] border border-museum-border rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Visitor Language Distribution</h3>
            <p className="text-xs text-museum-muted mb-2">Real-time localized interface adoption</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.languageDistribution || []}
                    dataKey="count"
                    nameKey="language"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={42}
                    paddingAngle={3}
                  >
                    {data?.languageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#15181D', borderColor: '#2A303C', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Live Sensor Event Stream */}
      <div className="bg-[#15181D] border border-museum-border rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-1">Live Visitor Telemetry Stream</h3>
        <p className="text-xs text-museum-muted mb-4">Latest real-time sensor events, QR triggers, and AI interactions</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-museum-border text-museum-muted font-mono uppercase text-[10px]">
                <th className="pb-2">Event ID</th>
                <th className="pb-2">Session</th>
                <th className="pb-2">Event Type</th>
                <th className="pb-2">Exhibit / Target</th>
                <th className="pb-2">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-museum-border/40">
              {data?.recentEvents.slice(0, 7).map((evt) => (
                <tr key={evt.id} className="hover:bg-museum-elevated/40 transition-colors">
                  <td className="py-2.5 font-mono text-museum-gold text-[11px]">{evt.id}</td>
                  <td className="py-2.5 font-mono text-museum-muted">{evt.sessionId.substring(0, 16)}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-museum-elevated border border-museum-border capitalize text-white">
                      {evt.eventType}
                    </span>
                  </td>
                  <td className="py-2.5 text-museum-text">{evt.exhibitId || evt.galleryId || 'General Museum'}</td>
                  <td className="py-2.5 text-museum-muted text-[11px] font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

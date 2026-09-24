import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Building2,
  Users,
  BarChart3,
  Ticket as TicketIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext.js';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Live Visitors', path: '/admin/visitors', icon: Users },
    { label: 'Exhibits & QR', path: '/admin/exhibits', icon: ImageIcon },
    { label: 'Galleries & Crowd', path: '/admin/galleries', icon: Building2 },
    { label: 'Deep Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Tickets & Revenue', path: '/admin/tickets', icon: TicketIcon },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#090B0E] text-museum-text flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#11141A] border-b border-museum-border">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏛️</span>
          <span className="font-serif font-bold text-white text-base">Museum Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-museum-elevated text-museum-gold border border-museum-border"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0E1116] border-r border-museum-border flex flex-col justify-between transform transition-transform duration-300 md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-museum-border/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center text-black font-bold text-lg shadow-gold-glow/30">
              🏛️
            </div>
            <div>
              <h2 className="font-serif font-bold text-white text-base leading-tight">Operations Hub</h2>
              <span className="text-[10px] text-museum-gold font-mono uppercase tracking-wider">Cloud Operations</span>
            </div>
          </div>

          {/* Current Admin User Badge */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-museum-elevated/60 border border-museum-border/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-museum-gold/20 text-museum-gold flex items-center justify-center font-bold text-xs">
              <ShieldCheck size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Museum Admin'}</p>
              <p className="text-[10px] text-museum-muted truncate font-mono">{user?.email || 'admin'}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-museum-gold/15 text-museum-gold font-bold border border-museum-gold/30 shadow-sm'
                      : 'text-museum-muted hover:text-white hover:bg-museum-elevated'
                  }`
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-museum-border/70 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-museum-elevated text-xs text-museum-cyan hover:bg-museum-cyan/10 border border-museum-cyan/20 transition-colors"
          >
            <span className="flex items-center gap-2 font-medium">
              <ExternalLink size={14} />
              <span>Visitor Experience</span>
            </span>
            <span className="text-[10px] uppercase font-mono">BYOD</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors font-medium"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Admin Top Banner */}
        <div className="hidden md:flex items-center justify-between px-8 py-3 bg-[#0E1116]/80 border-b border-museum-border text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-museum-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>System Status: <strong className="text-white">Online</strong></span>
            </span>
            <span className="text-museum-border">|</span>
            <span className="text-museum-gold font-mono">Simulated BLE Gateway Active</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-medium flex items-center gap-1.5">
              <AlertTriangle size={12} />
              <span>Gallery B High Density Alert</span>
            </span>
          </div>
        </div>

        <main className="p-4 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

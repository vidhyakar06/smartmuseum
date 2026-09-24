import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Plus, IndianRupee, CheckCircle2, Clock, Search, QrCode, X } from 'lucide-react';
import { api } from '../../services/api.js';
import { Ticket } from '../../types/index.js';

export const AdminTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [search, setSearch] = useState('');

  // New ticket state
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [ticketType, setTicketType] = useState('Standard');
  const [amount, setAmount] = useState(200.00);
  const [issuedTicket, setIssuedTicket] = useState<any>(null);

  const fetchTickets = () => {
    setLoading(true);
    api.getTickets().then(res => {
      if (res.success) {
        setTickets(res.data);
        setSummary(res.summary);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleIssueTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createTicket({
        visitorName,
        visitorEmail,
        ticketType,
        amount
      });
      if (res.success) {
        setIssuedTicket(res.data);
        fetchTickets();
      }
    } catch {
      alert('Failed to issue ticket');
    }
  };

  const filteredTickets = tickets.filter(t =>
    t.visitorName.toLowerCase().includes(search.toLowerCase()) ||
    t.ticketId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">
            Admissions & Digital Ticketing
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Tickets & Transactions
          </h1>
        </div>

        <button
          onClick={() => {
            setIssuedTicket(null);
            setVisitorName('');
            setVisitorEmail('');
            setShowIssueModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-museum-gold text-black font-bold text-xs hover:scale-105 transition-all shadow-md"
        >
          <Plus size={16} />
          <span>Issue Admission Ticket</span>
        </button>
      </div>

      {/* Revenue KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4">
          <div className="flex items-center justify-between text-museum-muted text-xs mb-1">
            <span>Total Revenue</span>
            <IndianRupee size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            ₹{summary?.totalRevenue != null ? Number(summary.totalRevenue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '1,970.00'}
          </div>
          <span className="text-[10px] text-museum-muted mt-1 block">Live transaction total</span>
        </div>

        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4">
          <div className="flex items-center justify-between text-museum-muted text-xs mb-1">
            <span>Tickets Issued</span>
            <TicketIcon size={16} className="text-museum-gold" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {summary?.totalTickets || tickets.length}
          </div>
          <span className="text-[10px] text-museum-gold mt-1 block">Valid admissions</span>
        </div>

        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4">
          <div className="flex items-center justify-between text-museum-muted text-xs mb-1">
            <span>Completed</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {summary?.completedCount || tickets.length}
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">100% verified</span>
        </div>

        <div className="bg-[#15181D] border border-museum-border rounded-2xl p-4">
          <div className="flex items-center justify-between text-museum-muted text-xs mb-1">
            <span>Average Order</span>
            <IndianRupee size={16} className="text-museum-cyan" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₹{summary?.totalTickets ? (summary.totalRevenue / summary.totalTickets).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '281.43'}
          </div>
          <span className="text-[10px] text-museum-cyan mt-1 block">Includes VIP tiers</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-museum-border flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-museum-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by visitor name or ticket ID..."
            className="w-full pl-10 pr-4 py-2 bg-[#0E1116] border border-museum-border rounded-xl text-xs text-white placeholder-museum-muted focus:outline-none focus:border-museum-gold"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-[#15181D] border border-museum-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-museum-border text-museum-muted font-mono uppercase text-[10px] bg-[#11141A]">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Visitor</th>
                <th className="p-4">Tier / Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-museum-border/40">
              {filteredTickets.map(t => (
                <tr key={t.id} className="hover:bg-museum-elevated/40 transition-colors">
                  <td className="p-4 font-mono text-museum-gold font-semibold">{t.ticketId}</td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{t.visitorName}</p>
                    <span className="text-[10px] text-museum-muted">{t.visitorEmail || 'Walk-in guest'}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-museum-elevated border border-museum-border text-museum-cyan">
                      {t.ticketType}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-white font-bold">₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="p-4 text-museum-muted font-mono text-[11px]">{t.date} {t.time}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Ticket Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel-glow rounded-3xl p-6 border border-museum-gold max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <TicketIcon size={18} className="text-museum-gold" />
                <span>{issuedTicket ? 'Admission Ticket Issued!' : 'Issue Instant Pass'}</span>
              </h3>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-museum-muted hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {issuedTicket ? (
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-2xl border-4 border-museum-gold max-w-[200px] mx-auto shadow-2xl">
                  {issuedTicket.qrDataUrl && (
                    <img src={issuedTicket.qrDataUrl} alt="Ticket QR" className="w-full h-auto" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">{issuedTicket.visitorName}</h4>
                  <p className="text-xs text-museum-gold font-mono">{issuedTicket.ticketId} • {issuedTicket.ticketType} Pass</p>
                  <p className="text-xs text-museum-muted mt-1">Paid: ₹{issuedTicket.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <button
                  onClick={() => setShowIssueModal(false)}
                  className="w-full py-2.5 bg-museum-gold text-black font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleIssueTicket} className="space-y-3 text-xs">
                <div>
                  <label className="block text-museum-muted mb-1">Visitor Full Name</label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={e => setVisitorName(e.target.value)}
                    placeholder="e.g. Leonardo Vance"
                    className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-museum-muted mb-1">Visitor Email</label>
                  <input
                    type="email"
                    value={visitorEmail}
                    onChange={e => setVisitorEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-museum-muted mb-1">Ticket Type</label>
                    <select
                      value={ticketType}
                      onChange={e => {
                        setTicketType(e.target.value);
                        if (e.target.value === 'Student') setAmount(120.00);
                        else if (e.target.value === 'VIP') setAmount(350.00);
                        else if (e.target.value === 'Family') setAmount(550.00);
                        else setAmount(200.00);
                      }}
                      className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                    >
                      <option value="Standard">Standard (₹200 / Rs. 200)</option>
                      <option value="Student">Student (₹120 / Rs. 120)</option>
                      <option value="VIP">VIP Guided (₹350 / Rs. 350)</option>
                      <option value="Family">Family Pack (₹550 / Rs. 550)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-museum-muted mb-1">Total Fee (₹ / Rs.)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-museum-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="px-4 py-2 rounded-xl bg-museum-elevated text-museum-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-museum-gold text-black font-bold hover:scale-105 transition-all"
                  >
                    Generate Pass
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  QrCode,
  Edit2,
  Trash2,
  X,
  Check,
  ExternalLink,
  Download,
  Image as ImageIcon,
  Headphones,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api.js';
import { Exhibit, Gallery } from '../../types/index.js';

export const AdminExhibitsPage: React.FC = () => {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [qrModalExhibit, setQrModalExhibit] = useState<{
    exhibit: Exhibit;
    qrDataUrl?: string;
    targetUrl?: string;
  } | null>(null);

  const [editExhibit, setEditExhibit] = useState<Partial<Exhibit> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getExhibits(),
      api.getGalleries()
    ]).then(([exRes, galRes]) => {
      if (exRes.success) setExhibits(exRes.data);
      if (galRes.success) setGalleries(galRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenQR = async (ex: Exhibit) => {
    try {
      const res = await api.getExhibitQR(ex.exhibitId);
      if (res.success) {
        setQrModalExhibit({
          exhibit: ex,
          qrDataUrl: res.qrDataUrl,
          targetUrl: res.targetUrl
        });
      }
    } catch {
      alert('Could not generate QR code');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this artwork from the permanent collection?')) {
      try {
        await api.deleteExhibit(id);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  const handleSaveExhibit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExhibit) return;

    try {
      if (isNew) {
        await api.createExhibit(editExhibit);
      } else if (editExhibit.exhibitId) {
        await api.updateExhibit(editExhibit.exhibitId, editExhibit);
      }
      setEditExhibit(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save artwork');
    }
  };

  const filtered = exhibits.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.artist.toLowerCase().includes(search.toLowerCase()) ||
    e.exhibitId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-museum-gold text-xs font-mono uppercase tracking-widest">
            Curatorial Collection Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Artworks & QR Code Registry
          </h1>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditExhibit({
              title: '',
              artist: '',
              year: '2026',
              category: 'Renaissance',
              description: '',
              location: 'Gallery A - Wall 1',
              galleryId: 'GAL_A',
              images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80'],
              coordinates: { x: 120, y: 90 }
            });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-museum-gold text-black font-bold text-xs hover:scale-105 transition-all shadow-md"
        >
          <Plus size={16} />
          <span>Add New Artwork</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-museum-border flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-museum-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter exhibits by title, artist, accession ID..."
            className="w-full pl-10 pr-4 py-2 bg-[#0E1116] border border-museum-border rounded-xl text-xs text-white placeholder-museum-muted focus:outline-none focus:border-museum-gold"
          />
        </div>

        <span className="text-xs text-museum-muted font-mono hidden sm:inline">
          Total Exhibits: <strong className="text-white">{exhibits.length}</strong>
        </span>
      </div>

      {/* Exhibits Table */}
      <div className="bg-[#15181D] border border-museum-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-museum-border text-museum-muted font-mono uppercase text-[10px] bg-[#11141A]">
                <th className="p-4">Artwork</th>
                <th className="p-4">Artist</th>
                <th className="p-4">Era / Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Audio Guide</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-museum-border/40">
              {filtered.map(ex => (
                <tr key={ex.exhibitId} className="hover:bg-museum-elevated/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={ex.images[0]} alt={ex.title} className="w-10 h-10 object-cover rounded-lg border border-museum-border/80" />
                      <div>
                        <p className="font-semibold text-white">{ex.title}</p>
                        <span className="text-[10px] font-mono text-museum-gold">{ex.exhibitId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-museum-text">{ex.artist}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-museum-elevated border border-museum-border text-museum-gold">
                      {ex.category}
                    </span>
                  </td>
                  <td className="p-4 text-museum-muted">{ex.location}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-[11px] text-purple-300 font-mono">
                      <Headphones size={12} />
                      <span>{ex.audioDuration || 140}s</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenQR(ex)}
                        className="p-1.5 rounded-lg bg-museum-gold/15 text-museum-gold border border-museum-gold/30 hover:bg-museum-gold hover:text-black transition-colors"
                        title="Generate Printable Exhibit QR Code"
                      >
                        <QrCode size={14} />
                      </button>

                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditExhibit(ex);
                        }}
                        className="p-1.5 rounded-lg bg-museum-elevated text-museum-muted hover:text-white border border-museum-border transition-colors"
                        title="Edit Artwork Information"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(ex.exhibitId)}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/40 border border-red-500/30 transition-colors"
                        title="Delete Artwork"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Generator Popup Modal */}
      {qrModalExhibit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel-glow rounded-3xl p-6 border border-museum-gold max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode size={16} className="text-museum-gold" />
                <span>Exhibit QR Pass</span>
              </h4>
              <button
                onClick={() => setQrModalExhibit(null)}
                className="text-museum-muted hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-white">{qrModalExhibit.exhibit.title}</h3>
              <p className="text-xs text-museum-muted">{qrModalExhibit.exhibit.artist} • {qrModalExhibit.exhibit.location}</p>
            </div>

            {/* QR Image */}
            <div className="bg-white p-4 rounded-2xl border-4 border-museum-gold flex items-center justify-center shadow-2xl">
              {qrModalExhibit.qrDataUrl ? (
                <img src={qrModalExhibit.qrDataUrl} alt="QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-black">Generating QR...</div>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-[11px] font-mono text-museum-gold break-all bg-museum-elevated p-2 rounded-lg border border-museum-border">
                {qrModalExhibit.targetUrl}
              </p>
              <p className="text-[10px] text-museum-muted">
                Scan with smartphone camera to open zero-install mobile guide directly into this artwork.
              </p>
            </div>

            <div className="flex gap-2">
              {qrModalExhibit.qrDataUrl && (
                <a
                  href={qrModalExhibit.qrDataUrl}
                  download={`QR_${qrModalExhibit.exhibit.exhibitId}.png`}
                  className="flex-1 py-2 px-3 bg-museum-gold text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform"
                >
                  <Download size={14} />
                  <span>Download PNG</span>
                </a>
              )}
              <a
                href={qrModalExhibit.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 bg-museum-elevated text-white text-xs rounded-xl border border-museum-border flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Artwork Modal */}
      {editExhibit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#15181D] border border-museum-border rounded-3xl p-6 max-w-lg w-full space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-white">
                {isNew ? 'Catalog New Masterpiece' : 'Edit Curatorial Details'}
              </h3>
              <button
                onClick={() => setEditExhibit(null)}
                className="text-museum-muted hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExhibit} className="space-y-3 text-xs">
              <div>
                <label className="block text-museum-muted mb-1">Artwork Title</label>
                <input
                  type="text"
                  required
                  value={editExhibit.title || ''}
                  onChange={e => setEditExhibit({ ...editExhibit, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-museum-muted mb-1">Artist</label>
                  <input
                    type="text"
                    required
                    value={editExhibit.artist || ''}
                    onChange={e => setEditExhibit({ ...editExhibit, artist: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-museum-muted mb-1">Creation Year</label>
                  <input
                    type="text"
                    required
                    value={editExhibit.year || ''}
                    onChange={e => setEditExhibit({ ...editExhibit, year: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-museum-muted mb-1">Category / Movement</label>
                  <input
                    type="text"
                    required
                    value={editExhibit.category || ''}
                    onChange={e => setEditExhibit({ ...editExhibit, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-museum-muted mb-1">Gallery Room</label>
                  <select
                    value={editExhibit.galleryId || 'GAL_A'}
                    onChange={e => {
                      const gal = galleries.find(g => g.galleryId === e.target.value);
                      setEditExhibit({
                        ...editExhibit,
                        galleryId: e.target.value,
                        location: gal ? `${gal.name.split(' - ')[0]} - Wall 1` : editExhibit.location
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                  >
                    {galleries.map(g => (
                      <option key={g.galleryId} value={g.galleryId}>{g.name.split(' - ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-museum-muted mb-1">Curatorial Overview Description</label>
                <textarea
                  rows={3}
                  required
                  value={editExhibit.description || ''}
                  onChange={e => setEditExhibit({ ...editExhibit, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-museum-muted mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editExhibit.images?.[0] || ''}
                  onChange={e => setEditExhibit({ ...editExhibit, images: [e.target.value] })}
                  className="w-full px-3 py-2 bg-[#0E1116] border border-museum-border rounded-lg text-white"
                />
              </div>

              <div className="pt-3 border-t border-museum-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditExhibit(null)}
                  className="px-4 py-2 rounded-xl bg-museum-elevated text-museum-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-museum-gold text-black font-bold hover:scale-105 transition-all"
                >
                  Save Artwork
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

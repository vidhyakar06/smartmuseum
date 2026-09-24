import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext.js';
import { api } from '../../services/api.js';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.loginAdmin({ email, password });
      if (res.success && res.token) {
        login(res.token, res.user);
        navigate('/admin');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B0E] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-museum-gold to-museum-gold-light text-black flex items-center justify-center mx-auto text-2xl shadow-gold-glow/40 font-bold mb-3">
            🏛️
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Curator & Admin Portal</h1>
          <p className="text-xs text-museum-muted">
            Sign in with your admin credentials to access museum analytics, crowd controls, and management tools.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-museum-gold/30 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-museum-muted mb-1.5 uppercase tracking-wider">
                Staff Email / Gmail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-museum-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0E1116] border border-museum-border rounded-xl text-xs text-white placeholder-museum-muted focus:outline-none focus:border-museum-gold focus:ring-1 focus:ring-museum-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-museum-muted mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-museum-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0E1116] border border-museum-border rounded-xl text-xs text-white placeholder-museum-muted focus:outline-none focus:border-museum-gold focus:ring-1 focus:ring-museum-gold"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-museum-gold text-black font-bold text-xs hover:scale-[1.02] active:scale-98 transition-all shadow-lg shadow-museum-gold/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-museum-muted hover:text-white transition-colors"
          >
            ← Return to Visitor Experience
          </Link>
        </div>
      </div>
    </div>
  );
};

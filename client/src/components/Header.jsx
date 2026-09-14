import React from 'react';
import { Terminal, RefreshCw, User, LogOut, Settings, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Header({ 
  user, 
  handles, 
  onOpenAuth, 
  onLogout, 
  onOpenHandles, 
  onRefreshStats, 
  loading,
  onLoadPreset
}) {
  const hasHandles = handles.leetcode || handles.codeforces || handles.github || handles.codechef;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080b11]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/20 text-white font-bold">
            <Terminal className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DevPulse
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-800/50 text-sky-400 tracking-wider">
                Universal Tracker
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Real-time multi-platform coding journey & metrics
            </p>
          </div>
        </div>

        {/* Quick Presets / Handles indicator */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onLoadPreset('pro')}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            title="Load demo handles: Neal Wu, Tourist, Torvalds"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Demo Legends</span>
          </button>
          
          <button
            onClick={onOpenHandles}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-300 transition flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-sky-400" />
            <span>Configure Handles</span>
          </button>
        </div>

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            onClick={onRefreshStats}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
            title="Refresh live data from APIs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* User Status / Login Window Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={onOpenHandles}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">
                  {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
                    {user.name || user.username}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    Handles Synced
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 transition-all flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login & Save Handles</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">
                  Free
                </span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
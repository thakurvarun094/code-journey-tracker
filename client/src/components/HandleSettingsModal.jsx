import React, { useState } from 'react';
import { X, Check, CheckCircle2, AlertCircle, RefreshCw, Save, Sparkles, ExternalLink } from 'lucide-react';
import { statsAPI, authAPI, guestHandlesStorage } from '../services/api';

export default function HandleSettingsModal({ 
  isOpen, 
  onClose, 
  currentHandles, 
  onHandlesSaved, 
  isLoggedIn 
}) {
  if (!isOpen) return null;

  const [handles, setHandles] = useState({
    leetcode: currentHandles?.leetcode || '',
    codeforces: currentHandles?.codeforces || '',
    github: currentHandles?.github || '',
    codechef: currentHandles?.codechef || ''
  });

  const [verifying, setVerifying] = useState({});
  const [verifiedStatus, setVerifiedStatus] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (platform) => {
    const handle = handles[platform]?.trim();
    if (!handle) {
      setVerifiedStatus(prev => ({ ...prev, [platform]: null }));
      return;
    }

    setVerifying(prev => ({ ...prev, [platform]: true }));
    try {
      const res = await statsAPI.verifyHandle(platform, handle);
      setVerifiedStatus(prev => ({
        ...prev,
        [platform]: {
          valid: res.valid,
          message: res.valid ? 'Verified successfully' : (res.details?.error || 'User not found')
        }
      }));
    } catch (err) {
      setVerifiedStatus(prev => ({
        ...prev,
        [platform]: { valid: false, message: err.message || 'Verification check failed' }
      }));
    } finally {
      setVerifying(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isLoggedIn) {
        await authAPI.updateHandles(handles);
      } else {
        guestHandlesStorage.set(handles);
      }
      onHandlesSaved(handles);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save handles');
    } finally {
      setSaving(false);
    }
  };

  const platforms = [
    {
      id: 'leetcode',
      name: 'LeetCode',
      iconUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-leetcode-3521542-2944960.png',
      placeholder: 'e.g. neal_wu or your_lc_username',
      accent: 'border-amber-500/50 text-amber-400 focus:border-amber-400'
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      iconUrl: 'https://assets.codeforces.com/favicon-32x32.png',
      placeholder: 'e.g. tourist or your_cf_handle',
      accent: 'border-sky-500/50 text-sky-400 focus:border-sky-400'
    },
    {
      id: 'github',
      name: 'GitHub',
      iconUrl: 'https://github.githubassets.com/favicons/favicon.png',
      placeholder: 'e.g. torvalds or your_gh_user',
      accent: 'border-purple-500/50 text-purple-400 focus:border-purple-400'
    },
    {
      id: 'codechef',
      name: 'CodeChef',
      iconUrl: 'https://cdn.codechef.com/favicon.ico',
      placeholder: 'e.g. gennady.korotkevich or your_codechef',
      accent: 'border-amber-600/50 text-amber-500 focus:border-amber-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Platform Handles</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Connect Your Profiles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your username/handle for each platform. Click "Test" to verify the live API connection before saving.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {platforms.map(p => {
            const isVerified = verifiedStatus[p.id];
            const isLoading = verifying[p.id];

            return (
              <div key={p.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    {p.name}
                  </span>
                  
                  {isVerified && (
                    <span className={`text-[11px] font-medium flex items-center gap-1 ${
                      isVerified.valid ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {isVerified.valid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {isVerified.message}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={handles[p.id]}
                    onChange={(e) => {
                      setHandles({ ...handles, [p.id]: e.target.value });
                      setVerifiedStatus(prev => ({ ...prev, [p.id]: null }));
                    }}
                    placeholder={p.placeholder}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:ring-1 focus:ring-sky-500 text-xs text-white placeholder-slate-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerify(p.id)}
                    disabled={isLoading || !handles[p.id]?.trim()}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-sky-400" />
                    ) : (
                      <span>Test</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setHandles({
                  leetcode: 'neal_wu',
                  codeforces: 'tourist',
                  github: 'torvalds',
                  codechef: 'gennady.korotkevich'
                });
              }}
              className="text-xs text-slate-400 hover:text-sky-400 transition"
            >
              Fill Sample Handles
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : isLoggedIn ? 'Save to My Account' : 'Apply Handles'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
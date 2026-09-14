import React from 'react';
import { 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Star, 
  Flame, 
  GitPullRequest, 
  TrendingUp, 
  Percent, 
  ShieldCheck,
  User,
  Hash
} from 'lucide-react';

export default function PlatformCards({ platforms, handles, onOpenHandles }) {
  const lc = platforms?.leetcode;
  const cf = platforms?.codeforces;
  const gh = platforms?.github;
  const cc = platforms?.codechef;

  // Codeforces rank color helper
  const getCfColor = (rank = '') => {
    const r = rank.toLowerCase();
    if (r.includes('legendary') || r.includes('grandmaster')) return 'text-red-500 border-red-500/40 bg-red-950/20';
    if (r.includes('master')) return 'text-amber-400 border-amber-400/40 bg-amber-950/20';
    if (r.includes('candidate master')) return 'text-purple-400 border-purple-400/40 bg-purple-950/20';
    if (r.includes('expert')) return 'text-blue-400 border-blue-400/40 bg-blue-950/20';
    if (r.includes('specialist')) return 'text-cyan-400 border-cyan-400/40 bg-cyan-950/20';
    if (r.includes('pupil')) return 'text-emerald-400 border-emerald-400/40 bg-emerald-950/20';
    return 'text-slate-400 border-slate-700 bg-slate-900';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            Platform Deep Dives
          </h2>
          <p className="text-xs text-slate-400">
            Real-time verified metrics pulled directly from platform APIs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ================= LEETCODE CARD ================= */}
        <div className="rounded-2xl bg-gradient-to-b from-[#111726] to-[#0d121f] border border-amber-500/20 p-6 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-lg">
                LC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">LeetCode</h3>
                  {lc?.success && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {handles?.leetcode ? `@${handles.leetcode}` : 'No handle set'}
                </p>
              </div>
            </div>

            {lc?.profileUrl && (
              <a 
                href={lc.profileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-400 hover:text-amber-400 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {lc?.success ? (
            <div className="mt-5 space-y-5">
              {/* Solved Progress Overview */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                  <span className="text-[11px] font-semibold text-emerald-400">Easy</span>
                  <div className="text-xl font-bold text-white mt-0.5">{lc.easySolved}</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
                  <span className="text-[11px] font-semibold text-amber-400">Medium</span>
                  <div className="text-xl font-bold text-white mt-0.5">{lc.mediumSolved}</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                  <span className="text-[11px] font-semibold text-rose-400">Hard</span>
                  <div className="text-xl font-bold text-white mt-0.5">{lc.hardSolved}</div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Solved</span>
                  <span className="font-bold text-white">{lc.totalSolved} questions</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full" 
                    style={{ width: `${lc.totalSolved ? (lc.easySolved / lc.totalSolved) * 100 : 0}%` }}
                    title="Easy"
                  />
                  <div 
                    className="bg-amber-500 h-full" 
                    style={{ width: `${lc.totalSolved ? (lc.mediumSolved / lc.totalSolved) * 100 : 0}%` }}
                    title="Medium"
                  />
                  <div 
                    className="bg-rose-500 h-full" 
                    style={{ width: `${lc.totalSolved ? (lc.hardSolved / lc.totalSolved) * 100 : 0}%` }}
                    title="Hard"
                  />
                </div>
              </div>

              {/* Contest & Extra Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Contest Rating</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-white text-base">
                      {lc.contest?.rating || 'Unrated'}
                    </span>
                    {lc.contest?.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                        {lc.contest.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Global Rank</span>
                  <div className="font-bold text-white text-base mt-1">
                    {lc.ranking ? `#${Number(lc.ranking).toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="mt-8 py-8 text-center">
              <p className="text-xs text-slate-400">
                {handles?.leetcode ? 'Failed to fetch LeetCode data or user not found' : 'No LeetCode handle configured'}
              </p>
              <button
                onClick={onOpenHandles}
                className="mt-3 px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition"
              >
                Set LeetCode Handle
              </button>
            </div>
          )}
        </div>


        {/* ================= CODEFORCES CARD ================= */}
        <div className="rounded-2xl bg-gradient-to-b from-[#111726] to-[#0d121f] border border-sky-500/20 p-6 shadow-xl relative overflow-hidden group hover:border-sky-500/40 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center font-bold text-sky-400 text-lg">
                CF
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Codeforces</h3>
                  {cf?.success && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {handles?.codeforces ? `@${handles.codeforces}` : 'No handle set'}
                </p>
              </div>
            </div>

            {cf?.profileUrl && (
              <a 
                href={cf.profileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500 text-slate-400 hover:text-sky-400 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {cf?.success ? (
            <div className="mt-5 space-y-5">
              {/* Rank Banner */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${getCfColor(cf.rank)}`}>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-80">Rank Title</span>
                  <span className="text-base font-extrabold capitalize">{cf.rank || 'Unrated'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-80">Max Rating</span>
                  <span className="text-base font-extrabold">{cf.maxRating || 0}</span>
                </div>
              </div>

              {/* Rating Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Rating: <strong className="text-white">{cf.rating || 0}</strong></span>
                  <span className="text-slate-400">Peak: <strong className="text-white">{cf.maxRating || 0}</strong></span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${cf.maxRating ? Math.min(100, (cf.rating / 3500) * 100) : 0}%` }}
                  />
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Solved In Submissions</span>
                  <div className="font-bold text-white text-base mt-1">
                    {cf.totalSolved} problems
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Contribution Score</span>
                  <div className="font-bold text-white text-base mt-1">
                    {cf.contribution >= 0 ? `+${cf.contribution}` : cf.contribution}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="mt-8 py-8 text-center">
              <p className="text-xs text-slate-400">
                {handles?.codeforces ? 'Failed to fetch Codeforces data or user not found' : 'No Codeforces handle configured'}
              </p>
              <button
                onClick={onOpenHandles}
                className="mt-3 px-4 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs font-semibold transition"
              >
                Set Codeforces Handle
              </button>
            </div>
          )}
        </div>


        {/* ================= GITHUB CARD ================= */}
        <div className="rounded-2xl bg-gradient-to-b from-[#111726] to-[#0d121f] border border-purple-500/20 p-6 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-lg">
                GH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">GitHub</h3>
                  {gh?.success && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {handles?.github ? `@${handles.github}` : 'No handle set'}
                </p>
              </div>
            </div>

            {gh?.profileUrl && (
              <a 
                href={gh.profileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-slate-400 hover:text-purple-400 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {gh?.success ? (
            <div className="mt-5 space-y-5">
              {/* Profile Bar */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                {gh.avatar && (
                  <img src={gh.avatar} alt="GH Avatar" className="w-10 h-10 rounded-full border border-purple-500/40" />
                )}
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{gh.name || gh.handle}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{gh.bio || 'Open source developer'}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Repos</span>
                  <span className="font-bold text-white text-sm">{gh.publicRepos}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Stars Tally</span>
                  <span className="font-bold text-amber-400 text-sm">{gh.totalStars} ★</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Followers</span>
                  <span className="font-bold text-white text-sm">{gh.followers}</span>
                </div>
              </div>

              {/* Top Tech Stack Tags */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 mb-2 block">Top Languages Used</span>
                <div className="flex flex-wrap gap-1.5">
                  {(gh.topLanguages || []).map(l => (
                    <span key={l.name} className="px-2 py-1 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300 text-[11px] font-mono">
                      {l.name} ({l.count})
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="mt-8 py-8 text-center">
              <p className="text-xs text-slate-400">
                {handles?.github ? 'Failed to fetch GitHub data or user not found' : 'No GitHub handle configured'}
              </p>
              <button
                onClick={onOpenHandles}
                className="mt-3 px-4 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-semibold transition"
              >
                Set GitHub Handle
              </button>
            </div>
          )}
        </div>


        {/* ================= CODECHEF CARD ================= */}
        <div className="rounded-2xl bg-gradient-to-b from-[#111726] to-[#0d121f] border border-amber-600/20 p-6 shadow-xl relative overflow-hidden group hover:border-amber-600/40 transition">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/15 border border-amber-600/30 flex items-center justify-center font-bold text-amber-500 text-lg">
                CC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">CodeChef</h3>
                  {cc?.success && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {handles?.codechef ? `@${handles.codechef}` : 'No handle set'}
                </p>
              </div>
            </div>

            {cc?.profileUrl && (
              <a 
                href={cc.profileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-600 text-slate-400 hover:text-amber-500 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {cc?.success ? (
            <div className="mt-5 space-y-5">
              {/* Star Rating Display */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-center">
                <div className="text-amber-400 text-xl font-bold tracking-wider">
                  {'★'.repeat(cc.stars || 1)}
                  <span className="text-xs text-slate-400 ml-2 font-mono">({cc.stars} Star Coder)</span>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-extrabold text-white">{cc.rating || 'Unrated'}</span>
                  <span className="text-xs text-slate-400 ml-1">Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Division</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">
                    {cc.rating >= 2000 ? 'Div 1' : cc.rating >= 1600 ? 'Div 2' : 'Div 3 / 4'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Platform Status</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block">Active</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="mt-8 py-8 text-center">
              <p className="text-xs text-slate-400">
                {handles?.codechef ? 'Failed to fetch CodeChef data or user not found' : 'No CodeChef handle configured'}
              </p>
              <button
                onClick={onOpenHandles}
                className="mt-3 px-4 py-1.5 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 text-xs font-semibold transition"
              >
                Set CodeChef Handle
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
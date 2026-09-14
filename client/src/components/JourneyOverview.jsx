import React from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  GitFork, 
  Star, 
  CheckCircle2, 
  TrendingUp, 
  Code2, 
  Zap,
  Target,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

export default function JourneyOverview({ summary, platforms, handles, onOpenHandles }) {
  const lc = platforms?.leetcode?.success ? platforms.leetcode : null;
  const cf = platforms?.codeforces?.success ? platforms.codeforces : null;
  const gh = platforms?.github?.success ? platforms.github : null;
  const cc = platforms?.codechef?.success ? platforms.codechef : null;

  // Problem breakdown data
  const lcEasy = lc?.easySolved || 0;
  const lcMedium = lc?.mediumSolved || 0;
  const lcHard = lc?.hardSolved || 0;
  const cfSolved = cf?.totalSolved || 0;

  const difficultyData = [
    { name: 'LeetCode Easy', value: lcEasy, color: '#10b981' },
    { name: 'LeetCode Medium', value: lcMedium, color: '#f59e0b' },
    { name: 'LeetCode Hard', value: lcHard, color: '#ef4444' },
    { name: 'Codeforces Solved', value: cfSolved, color: '#38bdf8' }
  ].filter(d => d.value > 0);

  // Contest ratings data
  const contestRatingsData = [
    ...(lc?.contest?.rating ? [{ platform: 'LeetCode Contest', rating: lc.contest.rating, fill: '#f59e0b' }] : []),
    ...(cf?.rating ? [{ platform: 'Codeforces', rating: cf.rating, fill: '#38bdf8' }] : []),
    ...(cf?.maxRating ? [{ platform: 'CF Peak', rating: cf.maxRating, fill: '#818cf8' }] : []),
    ...(cc?.rating ? [{ platform: 'CodeChef', rating: cc.rating, fill: '#d97706' }] : [])
  ];

  // GitHub languages
  const topLangs = gh?.topLanguages || [];

  return (
    <div className="space-y-6">
      
      {/* 4 Hero Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Solved */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#121929] to-[#0c101c] border border-slate-800/90 p-5 shadow-xl hover:border-sky-500/40 transition group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Solved
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {summary?.totalSolved?.toLocaleString() || 0}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">problems</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">LC: {lc?.totalSolved || 0}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400">CF: {cf?.totalSolved || 0}</span>
          </div>
        </div>

        {/* Card 2: Dev Journey Level */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#121929] to-[#0c101c] border border-slate-800/90 p-5 shadow-xl hover:border-indigo-500/40 transition group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Coder Rank & Level
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                Lvl {summary?.level || 1}
              </span>
              <span className="text-xs font-semibold text-slate-300 truncate">
                {summary?.rankTitle || 'Novice Coder'}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-sky-400 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, ((summary?.overallScore || 100) % 2000) / 20)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Score: {summary?.overallScore?.toLocaleString() || 0} XP
            </p>
          </div>
        </div>

        {/* Card 3: Peak Contest Rating */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#121929] to-[#0c101c] border border-slate-800/90 p-5 shadow-xl hover:border-amber-500/40 transition group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Peak Contest Rating
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {summary?.maxRating ? summary.maxRating.toLocaleString() : 'Unrated'}
            </span>
            <span className="text-xs text-amber-400/80 ml-1.5 font-medium">
              {cf?.rank || (lc?.contest?.badge ? lc.contest.badge : 'Competitive')}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            {cf?.rating ? (
              <span className="text-sky-400">CF Rating: {cf.rating}</span>
            ) : null}
            {lc?.contest?.rating ? (
              <span className="text-amber-400">LC Contest: {lc.contest.rating}</span>
            ) : null}
            {!cf?.rating && !lc?.contest?.rating && (
              <span className="text-slate-500">No contest rating yet</span>
            )}
          </div>
        </div>

        {/* Card 4: Open Source Impact */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#121929] to-[#0c101c] border border-slate-800/90 p-5 shadow-xl hover:border-purple-500/40 transition group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              GitHub Repos & Stars
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {gh?.totalStars?.toLocaleString() || 0}
              </span>
              <span className="text-xs text-slate-500 ml-1">★ stars</span>
            </div>
            <div className="text-sm font-semibold text-purple-400">
              {gh?.publicRepos || 0} repos
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 truncate">
            {gh?.bio || (gh?.followers ? `${gh.followers} followers on GitHub` : 'Open Source Developer')}
          </div>
        </div>

      </div>

      {/* Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Problem Solving Distribution */}
        <div className="rounded-2xl bg-[#0f1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" />
                Problem Difficulty Breakdown
              </h3>
              <p className="text-xs text-slate-400">Distribution across problem tiers</p>
            </div>
          </div>

          {difficultyData.length > 0 ? (
            <div className="h-52 w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0d14', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 shrink-0 pr-2">
                {difficultyData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-300">{d.name}:</span>
                    <span className="font-bold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-52 flex flex-col items-center justify-center text-center p-4">
              <Code2 className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-400">No problem solving stats loaded yet.</p>
              <button 
                onClick={onOpenHandles} 
                className="mt-2 text-xs text-sky-400 hover:underline"
              >
                Add LeetCode / Codeforces handle
              </button>
            </div>
          )}
        </div>

        {/* Chart 2: Contest Ratings Comparison */}
        <div className="rounded-2xl bg-[#0f1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Contest Ratings Comparison
              </h3>
              <p className="text-xs text-slate-400">Competitive ratings by platform</p>
            </div>
          </div>

          {contestRatingsData.length > 0 ? (
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contestRatingsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis 
                    dataKey="platform" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0d14', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="rating" radius={[6, 6, 0, 0]}>
                    {contestRatingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex flex-col items-center justify-center text-center p-4">
              <Flame className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-400">No contest ratings detected yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">Participate in LeetCode or Codeforces contests to view comparisons.</p>
            </div>
          )}
        </div>

        {/* Tech Stack & Top Languages (from GitHub) */}
        <div className="rounded-2xl bg-[#0f1422] border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Language Stack & Activity
              </h3>
              <p className="text-xs text-slate-400">Most used languages in repositories</p>
            </div>
          </div>

          {topLangs.length > 0 ? (
            <div className="space-y-3 pt-2">
              {topLangs.map((lang, idx) => {
                const colors = ['bg-sky-400', 'bg-indigo-400', 'bg-amber-400', 'bg-emerald-400', 'bg-purple-400', 'bg-rose-400'];
                const maxCount = topLangs[0].count || 1;
                const pct = Math.round((lang.count / maxCount) * 100);
                return (
                  <div key={lang.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{lang.name}</span>
                      <span className="text-slate-400 font-mono">{lang.count} repos</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${colors[idx % colors.length]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-52 flex flex-col items-center justify-center text-center p-4">
              <GitFork className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-400">No GitHub repositories analyzed.</p>
              <button 
                onClick={onOpenHandles} 
                className="mt-2 text-xs text-purple-400 hover:underline"
              >
                Connect GitHub username
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
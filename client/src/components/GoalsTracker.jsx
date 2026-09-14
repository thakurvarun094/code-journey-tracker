import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Plus, Trash2, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { authAPI } from '../services/api';

export default function GoalsTracker({ goals = [], onRefreshGoals, isLoggedIn, onOpenAuth, summary }) {
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalPlatform, setNewGoalPlatform] = useState('leetcode');
  const [loading, setLoading] = useState(false);

  const handleToggle = async (goal) => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    try {
      if (!goal.completed) {
        // Fire celebration confetti!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
      await authAPI.toggleGoal(goal.id);
      onRefreshGoals();
    } catch (err) {
      console.error('Failed to toggle goal:', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    setLoading(true);
    try {
      await authAPI.addGoal({
        text: newGoalText.trim(),
        platform: newGoalPlatform,
        target: 0
      });
      setNewGoalText('');
      onRefreshGoals();
    } catch (err) {
      console.error('Failed to add goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    try {
      await authAPI.deleteGoal(id);
      onRefreshGoals();
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPct = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="rounded-2xl bg-[#0f1422] border border-slate-800 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Coding Milestones & Targets</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Set custom goals, celebrate achievements, and track your coding progression.
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-white">{completedCount} of {goals.length}</span>
            <span className="text-[10px] text-slate-400 ml-1">completed ({progressPct}%)</span>
          </div>
          <div className="w-24 bg-slate-900 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add goal form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-2 mb-6">
        <input
          type="text"
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          placeholder="e.g. Solve 50 Tree/Graph questions, Reach 1700 rating..."
          className="w-full flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-xs text-white placeholder-slate-600 outline-none"
        />
        <select
          value={newGoalPlatform}
          onChange={(e) => setNewGoalPlatform(e.target.value)}
          className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 outline-none"
        >
          <option value="leetcode">LeetCode</option>
          <option value="codeforces">Codeforces</option>
          <option value="github">GitHub</option>
          <option value="codechef">CodeChef</option>
          <option value="general">General</option>
        </select>
        <button
          type="submit"
          disabled={loading || !newGoalText.trim()}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target</span>
        </button>
      </form>

      {/* Goals list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goals.map((g) => (
          <div
            key={g.id}
            onClick={() => handleToggle(g)}
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
              g.completed 
                ? 'bg-emerald-950/10 border-emerald-800/40 text-slate-400' 
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {g.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 hover:text-sky-400 shrink-0" />
              )}
              <div>
                <p className={`text-xs font-semibold ${g.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {g.text}
                </p>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {g.platform}
                </span>
              </div>
            </div>

            {isLoggedIn && (
              <button
                onClick={(e) => handleDelete(g.id, e)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition"
                title="Delete goal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!isLoggedIn && (
        <div className="mt-4 p-3 rounded-xl bg-sky-950/20 border border-sky-800/30 flex items-center justify-between text-xs text-sky-300">
          <span>Log in to sync and save your personal coding goals across devices!</span>
          <button 
            onClick={onOpenAuth}
            className="px-3 py-1 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-400 transition"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import JourneyOverview from './components/JourneyOverview.jsx';
import PlatformCards from './components/PlatformCards.jsx';
import GoalsTracker from './components/GoalsTracker.jsx';
import AuthModal from './components/AuthModal.jsx';
import HandleSettingsModal from './components/HandleSettingsModal.jsx';
import { authAPI, statsAPI, tokenStorage, guestHandlesStorage } from './services/api';
import { Sparkles, Terminal, Code2, Shield, Heart } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [handles, setHandles] = useState(guestHandlesStorage.get());
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHandlesOpen, setIsHandlesOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Initial Load & Auth Check
  useEffect(() => {
    const init = async () => {
      const token = tokenStorage.get();
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.user) {
            setUser(res.user);
            if (res.user.handles) {
              setHandles(res.user.handles);
            }
            if (res.user.goals) {
              setGoals(res.user.goals);
            }
          }
        } catch (err) {
          console.warn('Auth check failed:', err.message);
          tokenStorage.remove();
        }
      }
    };
    init();
  }, []);

  // Fetch stats when handles change
  const fetchStats = async (targetHandles = handles) => {
    setLoading(true);
    try {
      const data = await statsAPI.getAggregate(targetHandles);
      setStats(data);
    } catch (err) {
      console.error('Stats fetch error:', err);
      showToast('Error fetching live stats from platforms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(handles);
  }, [handles]);

  // Refresh goals from server
  const refreshGoals = async () => {
    if (user) {
      try {
        const res = await authAPI.getGoals();
        setGoals(res.goals || []);
      } catch (err) {
        console.error('Failed to get goals:', err);
      }
    }
  };

  // Auth success handler
  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    if (authUser.handles) {
      setHandles(authUser.handles);
    }
    if (authUser.goals) {
      setGoals(authUser.goals);
    }
    showToast(`Welcome, ${authUser.name || authUser.username}! Handles synced.`);
  };

  const handleLogout = () => {
    tokenStorage.remove();
    setUser(null);
    showToast('Logged out successfully');
  };

  const handleHandlesSaved = (newHandles) => {
    setHandles(newHandles);
    showToast('Platform handles updated!');
    fetchStats(newHandles);
  };

  const handleLoadPreset = (preset) => {
    if (preset === 'pro') {
      const proHandles = {
        leetcode: 'neal_wu',
        codeforces: 'tourist',
        github: 'torvalds',
        codechef: 'gennady.korotkevich'
      };
      setHandles(proHandles);
      guestHandlesStorage.set(proHandles);
      showToast('Loaded demo handles: Neal Wu, Tourist, Torvalds, Gennady Korotkevich');
    }
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-sky-500 text-white font-medium text-xs shadow-2xl animate-in slide-in-from-top duration-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        user={user}
        handles={handles}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenHandles={() => setIsHandlesOpen(true)}
        onRefreshStats={() => fetchStats(handles)}
        loading={loading}
        onLoadPreset={handleLoadPreset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Journey Overview / High-level stats & charts */}
        <JourneyOverview
          summary={stats?.summary}
          platforms={stats?.platforms}
          handles={handles}
          onOpenHandles={() => setIsHandlesOpen(true)}
        />

        {/* Platform Cards (LeetCode, Codeforces, GitHub, CodeChef) */}
        <PlatformCards
          platforms={stats?.platforms}
          handles={handles}
          onOpenHandles={() => setIsHandlesOpen(true)}
        />

        {/* Coding Milestones & Goals Tracker */}
        <GoalsTracker
          goals={goals.length ? goals : [
            { id: 'sample_1', text: 'Solve 100 LeetCode problems', platform: 'leetcode', completed: (stats?.platforms?.leetcode?.totalSolved || 0) >= 100 },
            { id: 'sample_2', text: 'Reach Codeforces Specialist (1400+)', platform: 'codeforces', completed: (stats?.platforms?.codeforces?.rating || 0) >= 1400 },
            { id: 'sample_3', text: '5+ Open source projects on GitHub', platform: 'github', completed: (stats?.platforms?.github?.publicRepos || 0) >= 5 }
          ]}
          onRefreshGoals={refreshGoals}
          isLoggedIn={!!user}
          onOpenAuth={() => setIsAuthOpen(true)}
          summary={stats?.summary}
        />

      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentHandles={handles}
      />

      <HandleSettingsModal
        isOpen={isHandlesOpen}
        onClose={() => setIsHandlesOpen(false)}
        currentHandles={handles}
        onHandlesSaved={handleHandlesSaved}
        isLoggedIn={!!user}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>DevPulse Coding Journey Tracker &copy; 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by LeetCode, Codeforces & GitHub Live APIs</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
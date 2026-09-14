const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuth } = require('./auth');

// Simple in-memory cache with 5-minute TTL
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (entry && (Date.now() - entry.timestamp) < CACHE_TTL_MS) {
    return entry.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, { timestamp: Date.now(), data });
}

// 1. LeetCode Fetcher
async function fetchLeetCode(handle) {
  const clean = handle.trim();
  if (!clean) return null;
  const cacheKey = 'lc_' + clean.toLowerCase();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Try direct LeetCode GraphQL
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            userAvatar
            realName
            reputation
            solutionCount
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          submissionCalendar
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
      }
    `;

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({ query, variables: { username: clean } })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.matchedUser) {
        const u = json.data.matchedUser;
        const c = json.data.userContestRanking;
        const ac = u.submitStatsGlobal?.acSubmissionNum || [];
        
        const allAc = ac.find(x => x.difficulty === 'All')?.count || 0;
        const easyAc = ac.find(x => x.difficulty === 'Easy')?.count || 0;
        const mediumAc = ac.find(x => x.difficulty === 'Medium')?.count || 0;
        const hardAc = ac.find(x => x.difficulty === 'Hard')?.count || 0;

        const totalSubmissions = ac.find(x => x.difficulty === 'All')?.submissions || 0;
        const acceptanceRate = totalSubmissions > 0 ? ((allAc / totalSubmissions) * 100).toFixed(1) : 'N/A';

        const result = {
          success: true,
          platform: 'leetcode',
          handle: u.username,
          avatar: u.profile?.userAvatar,
          ranking: u.profile?.ranking || 'N/A',
          reputation: u.profile?.reputation || 0,
          totalSolved: allAc,
          easySolved: easyAc,
          mediumSolved: mediumAc,
          hardSolved: hardAc,
          acceptanceRate: acceptanceRate,
          contest: c ? {
            rating: Math.round(c.rating || 0),
            globalRanking: c.globalRanking || 'N/A',
            contestsAttended: c.attendedContestsCount || 0,
            topPercentage: c.topPercentage ? Number(c.topPercentage).toFixed(1) : null,
            badge: c.badge?.name || null
          } : null,
          profileUrl: 'https://leetcode.com/' + clean
        };
        setCached(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('LeetCode GraphQL failed, trying fallback API:', err.message);
  }

  // Fallback API: leetcode-stats-api
  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${clean}`);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        const result = {
          success: true,
          platform: 'leetcode',
          handle: clean,
          avatar: null,
          ranking: data.ranking || 'N/A',
          reputation: data.reputation || 0,
          totalSolved: data.totalSolved || 0,
          easySolved: data.easySolved || 0,
          mediumSolved: data.mediumSolved || 0,
          hardSolved: data.hardSolved || 0,
          acceptanceRate: data.acceptanceRate || 'N/A',
          contest: null,
          profileUrl: 'https://leetcode.com/' + clean
        };
        setCached(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('LeetCode fallback failed:', err.message);
  }

  return { success: false, platform: 'leetcode', handle: clean, error: 'User not found or LeetCode API unavailable' };
}

// 2. Codeforces Fetcher
async function fetchCodeforces(handle) {
  const clean = handle.trim();
  if (!clean) return null;
  const cacheKey = 'cf_' + clean.toLowerCase();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const [infoRes, statusRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(clean)}`),
      fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(clean)}&from=1&count=500`)
    ]);

    const infoData = await infoRes.json();
    if (infoData.status !== 'OK' || !infoData.result?.length) {
      return { success: false, platform: 'codeforces', handle: clean, error: infoData.comment || 'User not found' };
    }

    const u = infoData.result[0];

    // Calculate unique solved count from submissions
    let solvedCount = 0;
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.status === 'OK' && Array.isArray(statusData.result)) {
        const solvedSet = new Set();
        statusData.result.forEach(s => {
          if (s.verdict === 'OK' && s.problem) {
            solvedSet.add(`${s.problem.contestId}-${s.problem.index}`);
          }
        });
        solvedCount = solvedSet.size;
      }
    }

    const result = {
      success: true,
      platform: 'codeforces',
      handle: u.handle,
      avatar: u.titlePhoto || u.avatar,
      rating: u.rating || 0,
      maxRating: u.maxRating || 0,
      rank: u.rank || 'Unrated',
      maxRank: u.maxRank || 'Unrated',
      contribution: u.contribution || 0,
      friendOfCount: u.friendOfCount || 0,
      totalSolved: solvedCount,
      profileUrl: `https://codeforces.com/profile/${u.handle}`
    };

    setCached(cacheKey, result);
    return result;
  } catch (err) {
    return { success: false, platform: 'codeforces', handle: clean, error: err.message };
  }
}

// 3. GitHub Fetcher
async function fetchGitHub(handle) {
  const clean = handle.trim();
  if (!clean) return null;
  const cacheKey = 'gh_' + clean.toLowerCase();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(clean)}`, {
        headers: { 'User-Agent': 'CodeJourneyTracker-App' }
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(clean)}/repos?sort=pushed&per_page=30`, {
        headers: { 'User-Agent': 'CodeJourneyTracker-App' }
      })
    ]);

    if (!userRes.ok) {
      return { success: false, platform: 'github', handle: clean, error: 'GitHub user not found' };
    }

    const u = await userRes.json();
    let totalStars = 0;
    const languagesMap = {};

    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos)) {
        repos.forEach(r => {
          totalStars += (r.stargazers_count || 0);
          if (r.language) {
            languagesMap[r.language] = (languagesMap[r.language] || 0) + 1;
          }
        });
      }
    }

    const sortedLangs = Object.entries(languagesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    const result = {
      success: true,
      platform: 'github',
      handle: u.login,
      name: u.name,
      avatar: u.avatar_url,
      bio: u.bio,
      publicRepos: u.public_repos || 0,
      publicGists: u.public_gists || 0,
      followers: u.followers || 0,
      following: u.following || 0,
      totalStars,
      topLanguages: sortedLangs,
      createdAt: u.created_at,
      profileUrl: u.html_url
    };

    setCached(cacheKey, result);
    return result;
  } catch (err) {
    return { success: false, platform: 'github', handle: clean, error: err.message };
  }
}

// 4. CodeChef Fetcher
async function fetchCodeChef(handle) {
  const clean = handle.trim();
  if (!clean) return null;
  const cacheKey = 'cc_' + clean.toLowerCase();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://www.codechef.com/users/${encodeURIComponent(clean)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      return { success: false, platform: 'codechef', handle: clean, error: 'CodeChef user not found' };
    }

    const html = await res.text();
    const ratingMatch = html.match(/class="rating-number">(\d+)/i) || 
                        html.match(/"rating":\s*"?(\d+)"?/i) || 
                        html.match(/rating-header[\s\S]*?>(\d{3,4})</i);
    
    const starsMatch = html.match(/class="rating-star">([\s\S]*?)<\/span>/i) || html.match(/(\d)\s*★/);
    let starsCount = 0;
    if (starsMatch) {
      if (starsMatch[1] && starsMatch[1].includes('&#9733;')) {
        starsCount = (starsMatch[1].match(/&#9733;/g) || []).length;
      } else if (starsMatch[1] && !isNaN(parseInt(starsMatch[1]))) {
        starsCount = parseInt(starsMatch[1]);
      }
    }

    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
    
    // Fallback stars if not parsed from html
    if (!starsCount && rating > 0) {
      if (rating < 1400) starsCount = 1;
      else if (rating < 1600) starsCount = 2;
      else if (rating < 1800) starsCount = 3;
      else if (rating < 2000) starsCount = 4;
      else if (rating < 2200) starsCount = 5;
      else if (rating < 2500) starsCount = 6;
      else starsCount = 7;
    }

    const result = {
      success: true,
      platform: 'codechef',
      handle: clean,
      rating,
      stars: starsCount,
      profileUrl: `https://www.codechef.com/users/${clean}`
    };

    setCached(cacheKey, result);
    return result;
  } catch (err) {
    return { success: false, platform: 'codechef', handle: clean, error: err.message };
  }
}

// Calculate combined developer score & level
function calculateOverallDevProfile(stats) {
  let totalSolved = 0;
  let maxRating = 0;
  let totalStars = 0;
  let repoCount = 0;

  if (stats.leetcode && stats.leetcode.success) {
    totalSolved += (stats.leetcode.totalSolved || 0);
    if (stats.leetcode.contest?.rating) {
      maxRating = Math.max(maxRating, stats.leetcode.contest.rating);
    }
  }

  if (stats.codeforces && stats.codeforces.success) {
    totalSolved += (stats.codeforces.totalSolved || 0);
    if (stats.codeforces.rating) {
      maxRating = Math.max(maxRating, stats.codeforces.rating);
    }
  }

  if (stats.github && stats.github.success) {
    totalStars += (stats.github.totalStars || 0);
    repoCount += (stats.github.publicRepos || 0);
  }

  if (stats.codechef && stats.codechef.success) {
    if (stats.codechef.rating) {
      maxRating = Math.max(maxRating, stats.codechef.rating);
    }
  }

  // Calculate experience score
  const score = (totalSolved * 10) + (maxRating * 2) + (totalStars * 25) + (repoCount * 15);

  // Level determination
  let level = 1;
  let rankTitle = 'Aspiring Coder';

  if (score > 12000 || maxRating >= 2400) {
    level = 10;
    rankTitle = 'Grandmaster Polyglot';
  } else if (score > 8000 || maxRating >= 2100) {
    level = 8;
    rankTitle = 'Master Algorithmist';
  } else if (score > 5000 || maxRating >= 1800) {
    level = 6;
    rankTitle = 'Senior Code Artisan';
  } else if (score > 2500 || maxRating >= 1500) {
    level = 4;
    rankTitle = 'Specialist Engineer';
  } else if (score > 1000 || totalSolved >= 100) {
    level = 3;
    rankTitle = 'Skilled Problem Solver';
  } else if (score > 400 || totalSolved >= 30) {
    level = 2;
    rankTitle = 'Apprentice Developer';
  }

  return {
    totalSolved,
    overallScore: score,
    level,
    rankTitle,
    maxRating,
    totalStars,
    repoCount
  };
}

// Single platform endpoints
router.get('/leetcode/:handle', async (req, res) => {
  const data = await fetchLeetCode(req.params.handle);
  res.json(data || { success: false });
});

router.get('/codeforces/:handle', async (req, res) => {
  const data = await fetchCodeforces(req.params.handle);
  res.json(data || { success: false });
});

router.get('/github/:handle', async (req, res) => {
  const data = await fetchGitHub(req.params.handle);
  res.json(data || { success: false });
});

router.get('/codechef/:handle', async (req, res) => {
  const data = await fetchCodeChef(req.params.handle);
  res.json(data || { success: false });
});

// Verify handle quickly
router.get('/verify/:platform/:handle', async (req, res) => {
  const { platform, handle } = req.params;
  let result = null;
  if (platform === 'leetcode') result = await fetchLeetCode(handle);
  else if (platform === 'codeforces') result = await fetchCodeforces(handle);
  else if (platform === 'github') result = await fetchGitHub(handle);
  else if (platform === 'codechef') result = await fetchCodeChef(handle);
  else return res.status(400).json({ error: 'Unsupported platform' });

  res.json({
    platform,
    handle,
    valid: !!(result && result.success),
    details: result
  });
});

// Aggregated All-in-One Fetch
router.get('/aggregate', optionalAuth, async (req, res) => {
  let handles = {
    leetcode: req.query.leetcode || '',
    codeforces: req.query.codeforces || '',
    github: req.query.github || '',
    codechef: req.query.codechef || ''
  };

  // If user is authenticated and query didn't specify, pull from user record
  if (req.userId) {
    const user = db.getUserById(req.userId);
    if (user && user.handles) {
      handles.leetcode = handles.leetcode || user.handles.leetcode || '';
      handles.codeforces = handles.codeforces || user.handles.codeforces || '';
      handles.github = handles.github || user.handles.github || '';
      handles.codechef = handles.codechef || user.handles.codechef || '';
    }
  }

  const [lc, cf, gh, cc] = await Promise.all([
    handles.leetcode ? fetchLeetCode(handles.leetcode) : Promise.resolve(null),
    handles.codeforces ? fetchCodeforces(handles.codeforces) : Promise.resolve(null),
    handles.github ? fetchGitHub(handles.github) : Promise.resolve(null),
    handles.codechef ? fetchCodeChef(handles.codechef) : Promise.resolve(null)
  ]);

  const stats = {
    leetcode: lc,
    codeforces: cf,
    github: gh,
    codechef: cc
  };

  const summary = calculateOverallDevProfile(stats);

  res.json({
    handles,
    summary,
    platforms: stats,
    fetchedAt: new Date().toISOString()
  });
});

module.exports = router;
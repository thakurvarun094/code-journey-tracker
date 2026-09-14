const API_BASE = '/api';

export const tokenStorage = {
  get: () => localStorage.getItem('cjt_token'),
  set: (token) => localStorage.setItem('cjt_token', token),
  remove: () => localStorage.removeItem('cjt_token'),
};

export const guestHandlesStorage = {
  get: () => {
    try {
      const h = localStorage.getItem('cjt_guest_handles');
      return h ? JSON.parse(h) : {
        leetcode: 'neal_wu',
        codeforces: 'tourist',
        github: 'torvalds',
        codechef: 'gennady.korotkevich'
      };
    } catch {
      return { leetcode: '', codeforces: '', github: '', codechef: '' };
    }
  },
  set: (handles) => localStorage.setItem('cjt_guest_handles', JSON.stringify(handles)),
};

async function request(endpoint, options = {}) {
  const token = tokenStorage.get();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const authAPI = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getMe: () => request('/auth/me'),
  updateHandles: (handles) => request('/auth/handles', {
    method: 'PUT',
    body: JSON.stringify(handles),
  }),
  getGoals: () => request('/auth/goals'),
  addGoal: (goal) => request('/auth/goals', {
    method: 'POST',
    body: JSON.stringify(goal),
  }),
  toggleGoal: (id) => request(`/auth/goals/${id}/toggle`, {
    method: 'PUT',
  }),
  deleteGoal: (id) => request(`/auth/goals/${id}`, {
    method: 'DELETE',
  }),
};

export const statsAPI = {
  getAggregate: (handles = {}) => {
    const params = new URLSearchParams();
    if (handles.leetcode) params.set('leetcode', handles.leetcode);
    if (handles.codeforces) params.set('codeforces', handles.codeforces);
    if (handles.github) params.set('github', handles.github);
    if (handles.codechef) params.set('codechef', handles.codechef);
    return request(`/stats/aggregate?${params.toString()}`);
  },
  getPlatform: (platform, handle) => request(`/stats/${platform}/${handle}`),
  verifyHandle: (platform, handle) => request(`/stats/verify/${platform}/${handle}`),
};
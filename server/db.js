const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_FILE = path.join(__dirname, 'data', 'users.json');

function initDB() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2), 'utf8');
  }
}

function readData() {
  initDB();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { users: [] };
  }
}

function writeData(data) {
  const tmpFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpFile, DATA_FILE);
}

const db = {
  getUserByEmailOrUsername(identifier) {
    const data = readData();
    const lower = identifier.toLowerCase().trim();
    return data.users.find(u => 
      u.email.toLowerCase() === lower || 
      u.username.toLowerCase() === lower
    ) || null;
  },

  getUserById(id) {
    const data = readData();
    return data.users.find(u => u.id === id) || null;
  },

  createUser({ username, email, password, name, initialHandles = {} }) {
    const data = readData();
    if (this.getUserByEmailOrUsername(username)) {
      throw new Error('Username is already taken');
    }
    if (this.getUserByEmailOrUsername(email)) {
      throw new Error('Email is already registered');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      name: name?.trim() || username.trim(),
      passwordHash,
      handles: {
        leetcode: initialHandles.leetcode?.trim() || '',
        codeforces: initialHandles.codeforces?.trim() || '',
        github: initialHandles.github?.trim() || '',
        codechef: initialHandles.codechef?.trim() || ''
      },
      goals: [
        {
          id: 'goal_1',
          text: 'Solve 100 LeetCode problems',
          platform: 'leetcode',
          target: 100,
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'goal_2',
          text: 'Reach Codeforces Specialist (1400+)',
          platform: 'codeforces',
          target: 1400,
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'goal_3',
          text: 'Contribute to open source on GitHub',
          platform: 'github',
          target: 5,
          completed: false,
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    data.users.push(newUser);
    writeData(data);

    // Return safe user without passwordHash
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },

  verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.passwordHash);
  },

  updateHandles(userId, handles) {
    const data = readData();
    const user = data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    user.handles = {
      ...user.handles,
      ...handles
    };
    writeData(data);
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  },

  getGoals(userId) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    return user.goals || [];
  },

  addGoal(userId, goalData) {
    const data = readData();
    const user = data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const newGoal = {
      id: 'goal_' + Date.now(),
      text: goalData.text,
      platform: goalData.platform || 'all',
      target: goalData.target || 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    if (!user.goals) user.goals = [];
    user.goals.push(newGoal);
    writeData(data);
    return newGoal;
  },

  toggleGoal(userId, goalId) {
    const data = readData();
    const user = data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const goal = (user.goals || []).find(g => g.id === goalId);
    if (!goal) throw new Error('Goal not found');

    goal.completed = !goal.completed;
    writeData(data);
    return goal;
  },

  deleteGoal(userId, goalId) {
    const data = readData();
    const user = data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    user.goals = (user.goals || []).filter(g => g.id !== goalId);
    writeData(data);
    return true;
  }
};

initDB();
module.exports = db;
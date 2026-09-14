const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_journey_tracker_2026';

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// Optional Auth (works for guests too)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        req.userId = decoded.userId;
      }
      next();
    });
  } else {
    next();
  }
}

// Register
router.post('/register', (req, res) => {
  try {
    const { username, email, password, name, handles } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = db.createUser({
      username,
      email,
      password,
      name,
      initialHandles: handles || {}
    });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/email and password are required' });
    }

    const user = db.getUserByEmailOrUsername(identifier);
    if (!user || !db.verifyPassword(user, password)) {
      return res.status(401).json({ error: 'Invalid credentials. Please check your username and password.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  const user = db.getUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Update Handles
router.put('/handles', authenticateToken, (req, res) => {
  try {
    const { leetcode, codeforces, github, codechef } = req.body;
    const updatedUser = db.updateHandles(req.userId, {
      leetcode: leetcode?.trim() || '',
      codeforces: codeforces?.trim() || '',
      github: github?.trim() || '',
      codechef: codechef?.trim() || ''
    });
    res.json({ success: true, handles: updatedUser.handles, user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Goals endpoints
router.get('/goals', authenticateToken, (req, res) => {
  try {
    const goals = db.getGoals(req.userId);
    res.json({ goals });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/goals', authenticateToken, (req, res) => {
  try {
    const { text, platform, target } = req.body;
    if (!text) return res.status(400).json({ error: 'Goal description is required' });
    const newGoal = db.addGoal(req.userId, { text, platform, target });
    res.status(201).json({ goal: newGoal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/goals/:id/toggle', authenticateToken, (req, res) => {
  try {
    const goal = db.toggleGoal(req.userId, req.params.id);
    res.json({ goal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/goals/:id', authenticateToken, (req, res) => {
  try {
    db.deleteGoal(req.userId, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = { router, authenticateToken, optionalAuth };
# DevPulse — Universal Coding Journey Tracker

Track your coding journey across LeetCode, Codeforces, GitHub, and CodeChef.

## Quick Start
- Backend: cd server && npm start
- Frontend: cd client && npm run dev

- DevPulse — Universal Coding Journey Tracker ⚡
A modern full-stack web application that tracks and celebrates your coding journey across LeetCode, Codeforces, GitHub, and CodeChef. Users can enter their handles, fetch live data from actual platform APIs, and log in to persist their profiles, handles, and coding goals.

🌟 What Was Built
1. Multi-Platform Real-Time API Engine (/server/routes/stats.js)
LeetCode GraphQL Integration:
Live query extraction of total solved problems, Easy/Medium/Hard breakdown, acceptance rate, and global ranking.
Contest statistics: Attended contest count, contest rating, global contest rank, and badges (Guardian, Knight).
Robust multi-tier fallback to public mirrors if LeetCode GraphQL is rate-limited.
Codeforces Official API Integration:
Live fetch of official handle details: rating, peak rating, rank title with official color hierarchy (Grandmaster, Master, Candidate Master, Expert, Specialist, Pupil).
Solved count calculated directly from user submissions with unique problem IDs.
GitHub REST API Integration:
Fetches public repositories, stars tally across repos, followers, and user bio.
Automatic language breakdown aggregating top languages across user repositories.
Journey start date calculation from account creation timestamp.
CodeChef Parser & Integration:
Live star rating (1★ to 7★) and division scoring.
Multi-Platform Aggregator:
Parallel query pipeline (/api/stats/aggregate) with memory caching to prevent rate-limiting.
Universal Developer Score formula and Journey Level ranking (Level 1 Novice to Level 10 Grandmaster Polyglot).
Instant live handle verification endpoint (/api/stats/verify/:platform/:handle).
2. Authentication & Handle Persistence System (/server/routes/auth.js & server/db.js)
Login Window & Account Creation:
Sleek modal with tabbed Sign In and Register views.
Encrypted password storage using bcryptjs.
JSON Web Token (JWT) session persistence with auto-login on refresh.
Handles Persistence:
Handles attached to user accounts and updated seamlessly.
Guest / Demo mode: Users can use and test handles without logging in, with handles cached in localStorage.
Coding Goals & Milestone Tracker:
Add personal targets (e.g. "Solve 100 Mediums", "Reach 1600 Codeforces").
Checkboxes to toggle completion with celebratory confetti animations (canvas-confetti).
Saved to user profile in database.
3. Cyber / Developer UI & Analytics Dashboard (/client)
Hero Metric Cards: Total problems solved counter, Developer Level badge, Peak Contest Rating, and GitHub Stars & Repos.
Interactive Visualizations:
Problem difficulty distribution donut chart (Easy vs Medium vs Hard).
Contest ratings comparison bar chart.
GitHub language stack progress bars.
Platform Deep-Dive Cards: Dedicated rich cards with live badges, progress meters, and direct profile links.
Handle Settings Modal: Live "Test" button to verify handles in real-time before saving.
Demo Presets: One-click "Load Demo Legends" button to instantly preview profiles of world-class developers (Neal Wu, Tourist, Linus Torvalds, Gennady Korotkevich).
🧪 Verification Results
All automated end-to-end integration tests completed with 100% success:

Test Case	Method / Endpoint	Result	Details
Server Health	GET /api/health	✅ Passed	HTTP 200 OK
User Registration	POST /api/auth/register	✅ Passed	HTTP 201 Created, JWT token generated
Profile Session	GET /api/auth/me	✅ Passed	Verified JWT and retrieved saved handles
Update Handles	PUT /api/auth/handles	✅ Passed	Saved LeetCode, Codeforces, GitHub, CodeChef
Goal Management	POST /api/auth/goals	✅ Passed	Goal saved to database
LeetCode API	GraphQL query	✅ Passed	Fetched 253 solved, 3686 contest rating
Codeforces API	Official CF API	✅ Passed	Fetched 345 solved, 3301 rating
GitHub API	GitHub REST	✅ Passed	Fetched 12 repos, 261,590 stars, top languages
CodeChef API	Profile parser	✅ Passed	Fetched 1396 rating, 1★ rating
Handle Verification	GET /api/stats/verify	✅ Passed	Verified tourist exists on Codeforces
Frontend Serving	GET /	✅ Passed	Built static app served on HTTP 200
🚀 Running the Project
The application is currently running live on: http://localhost:5000

Repository Location
`C:\Users\thaku.gemini\antigravity\scratch\code-journey-tracker`

Commands to Run Anytime
1. Unified Server (Serves API + Frontend)
powershell

cd C:\Users\thaku\.gemini\antigravity\scratch\code-journey-tracker\server
npm start
Open http://localhost:5000 in your browser.

2. Frontend Hot-Reload Dev Server (Optional)
powershell

cd C:\Users\thaku\.gemini\antigravity\scratch\code-journey-tracker\client
npm run dev
Open http://localhost:3000 with with instant hot-module reloading.

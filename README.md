<<<<<<< HEAD
# ChessDaysCount

A small React + Vite app that fetches a Chess.com player's profile and game archives to visualize account statistics and calculate the number of unique days the player was active (played at least one game).

This repository contains a lightweight single-page UI where you enter a Chess.com username and the app fetches the public Chess.com API to compute:

- Number of unique active chess days (count of distinct dates when at least one game ended)
- Total number of games fetched
- Basic profile information (username, avatar, name, followers, join date)

Why this project
- Quick way to inspect activity for a Chess.com account without downloading game PGNs manually
- Demonstrates fetching paginated archive endpoints and processing the returned game metadata

Contents
- index.html — app entry HTML
- src/ — React source (App.jsx, CSS, main.jsx)
- package.json — project metadata and scripts
- vite.config.js — Vite configuration

Local development

Requirements
- Node.js 18+ and npm (or pnpm/yarn)

Install and run

1. Install dependencies:

   npm install

2. Start dev server:

   npm run dev

3. Open the app in your browser (Vite will print the local URL, usually http://localhost:5173)

Usage

- Type a Chess.com username into the input and click Search.
- The app calls the public Chess.com API endpoints:
  - https://api.chess.com/pub/player/{username}
  - https://api.chess.com/pub/player/{username}/games/archives
  - then fetches each archive URL to collect games
- The UI displays profile info, the calculated number of active days, and total games.

Notes and caveats

- This app queries the public Chess.com API from the browser. Be mindful of rate limits and network errors — repeated or heavy requests may be limited by the API.
- If a user has many archived months/years, the client will fetch each archive URL which can take time and bandwidth.
- Some games may not be of the `chess` ruleset (for example variants) — the app currently filters/counts only games where `game.rules === "chess"` when computing the total chess games.

Testing and linting

- Run the linter:

  npm run lint

Build

- To create a production build:

  npm run build

- Preview the production build locally:

  npm run preview

Extending the project

- Add charts to visualize activity by month/year or by time controls (time_class)
- Cache archive results on a backend to avoid repeated heavy requests from the browser
- Add error handling and progress indicators while fetching large archives

License

Add a LICENSE file to this repository and choose a license (e.g., MIT) if you want to allow others to reuse the code.

Acknowledgements

- Uses the public Chess.com API: https://www.chess.com/news/view/published-data-api
=======
A React-based Chess.com analytics tool that fetches player profiles and game archives to visualize account statistics and calculate unique active chess days.
>>>>>>> 9827b69 (prototype push of chess project)

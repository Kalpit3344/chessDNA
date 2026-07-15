import { useMemo, useState } from "react";

import PlayerCard from "./components/PlayerCard";
import Logo from "./components/Logo";
import SearchBar from "./components/SearchBar";
import Nav from "./components/Nav";
import Loading from "./components/Loading";
import StatsCard from "./components/StatsCard";

import { usePlayerSearch } from "./hooks/usePlayerSearch";
import "./styles/App.css";

function App() {


  const [username, setUsername] = useState("");
  const [selectedDay, setSelectedDay] = useState(() => {
    const currentDate = new Date();
    return currentDate.toISOString().slice(0, 10);
  });
  const [selectedFormat, setSelectedFormat] = useState("Bullet");
  const [showNavbarSearch, setShowNavbarSearch] = useState(false);

  const formatOptions = ["Bullet", "Blitz", "Rapid"];

  const {
    player,
    stats,
    loading,
    error,
    searchPlayer,
    getGamesByDate,
    lastModified,
  } = usePlayerSearch();

  const archiveDayGames = useMemo(() => {
    if (!player) return [];
    return getGamesByDate(selectedDay, selectedFormat) || [];
  }, [player, selectedDay, selectedFormat, getGamesByDate]);

  return (
    <div className="app">
      {!player && !loading && (
        <main className="home-screen">
          <Logo />
          <p className="home-instructions">
            Start by entering a Chess.com username above. Once loaded, use the sidebar to
            pick a date and format, then review the archive games and today's performance.
            Use the search icon in the navbar to switch to a different player at any time.
          </p>

          <SearchBar
            username={username}
            setUsername={setUsername}
            searchPlayer={searchPlayer}
            variant="hero"
            placeholder="Enter UserName"
          />

          {error && <p className="error-message">{error}</p>}
        </main>
      )}

      {player && (
        <div className="dashboard-shell">
          <Nav
            username={username}
            setUsername={setUsername}
            searchPlayer={searchPlayer}
            showNavbarSearch={showNavbarSearch}
            setShowNavbarSearch={setShowNavbarSearch}
          />

          {loading ? (
            <Loading />
          ) : (
            <main className="dashboard-main">
              <section className="dashboard-panel profile-panel">
                <div className="overview-header">
                  <div>
                    <p className="overview-subtitle">Player Profile</p>
                    <h2>{player.username}</h2>
                  </div>
                  <span className="status-pill">{player.status || "Active"}</span>
                </div>

                <PlayerCard
                  player={player}
                  activeDaysCount={stats.activeDays}
                  totalGames={stats.totalGames}
                  lastModified={lastModified}
                />
              </section>

              <section className="dashboard-panel stats-panel">
                <div className="panel-heading">
                  <p className="panel-overline">ALL-AROUND GAME STATS</p>
                </div>
                <div className="stats-grid">
                  <StatsCard title="Active Days" value={stats.activeDays} />
                  <StatsCard title="Total Games" value={stats.totalGames} />
                  <StatsCard title="Followers" value={player.followers} />
                </div>
              </section>

              <aside className="dashboard-side">
                <div className="dashboard-card insights-card">
                  <p className="panel-overline">Today&apos;s Insights</p>
                  <div className="today-insights-list">
                    <div className="insight-row">
                      <span>Matches</span>
                      <strong>{stats.todayGames}</strong>
                    </div>
                    <div className="insight-row">
                      <span>Won</span>
                      <strong>{stats.todayWins}</strong>
                    </div>
                    <div className="insight-row">
                      <span>Loss</span>
                      <strong>{stats.todayLosses}</strong>
                    </div>
                    <div className="insight-row">
                      <span>Draw</span>
                      <strong>{stats.todayDraws}</strong>
                    </div>
                    <div className="insight-row">
                      <span>Win Rate</span>
                      <strong>{`${stats.todayWinRate}%`}</strong>
                    </div>
                    <div className="insight-row">
                      <span>Loss Rate</span>
                      <strong>{`${stats.todayLossRate}%`}</strong>
                    </div>
                    <div className="insight-row">
                      <span>Draw Rate</span>
                      <strong>{`${stats.todayDrawRate}%`}</strong>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card input-card">
                  <p className="panel-overline">Search For Day Game</p>
                  <input
                    type="date"
                    className="sidebar-input"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  />
                  <p className="panel-overline">Game Format</p>
                  <select
                    className="sidebar-input"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                  >
                    {formatOptions.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dashboard-card archive-card">
                  <p className="panel-overline">GAME ARCHIVE</p>
                  <p>Browse monthly archives for trends and performance snapshots.</p>
                  <div className="archive-today">
                    <span className="panel-overline">{selectedFormat} games on {selectedDay}</span>
                    <strong>{archiveDayGames.length}</strong>
                  </div>
                  {archiveDayGames && archiveDayGames.length > 0 ? (
                    <ul className="archive-list">
                      {archiveDayGames.map((g, idx) => (
                        <li key={idx} className="archive-item">
                          <div>
                            <div className="archive-players">
                              <strong>{g.white.username}</strong>
                              <span>vs</span>
                              <strong>{g.black.username}</strong>
                            </div>
                            <div className="archive-meta">
                              <span>White:  {g.white.rating || "-"}</span>
                              <span>&nbsp; B:  {g.black.rating || "-"}</span>
                            </div>
                          </div>
                          <div className="archive-actions">
                            <span className={`result ${g.outcome || ""}`}>
                              {g.outcome || "-"}
                            </span>
                            {g.url ? (
                              <a href={g.url} target="_blank" rel="noreferrer">View</a>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ marginTop: '0.8rem', color: 'var(--muted)' }}>No games for selected day.</p>
                  )}
                </div>
              </aside>
            </main>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {!player && loading && <Loading />}
    </div>
  );
}

export default App;
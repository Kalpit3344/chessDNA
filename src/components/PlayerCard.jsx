import "../styles/playercard.css";

function PlayerCard({ player, activeDaysCount, totalGames, lastModified }) {
  const { username, avatar, name, followers, joined, status } = player;

  const formatLastModified = (lm) => {
    if (!lm) return "Unknown";
    try {
      const d = new Date(lm);
      if (Number.isNaN(d.getTime())) return "Unknown";
      const fmt = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }).format(d);
      return `${fmt} UTC`;
    } catch (e) {
      return "Unknown";
    }
  };

  return (
    <div className="player-card">
      <div className="player-card-header">
        {avatar && (
          <img
            src={avatar}
            alt={`${username} profile`}
            className="player-avatar"
          />
        )}
        <div className="player-card-meta">
          <p className="player-name">{username}</p>
          <p className="player-role">{name || "Not provided"}</p>
        </div>
      </div>

      <div className="player-info-grid">
        {/* <div className="info-box">
          <p className="info-label">Followers</p>
          <p className="info-value">{followers}</p>
        </div> */}
        <div className="info-box">
          <p className="info-label">Status</p>
          <p className="info-value">{status || "Active"}</p>
        </div>
        <div className="info-box">
          <p className="info-label">Active Days</p>
          <p className="info-value">{activeDaysCount}</p>
        </div>
        <div className="info-box">
          <p className="info-label">Total Games</p>
          <p className="info-value">{totalGames}</p>
        </div>
        <div className="info-box">
          <p className="info-label">Joined</p>
          <p className="info-value">{new Date(joined * 1000).toLocaleDateString()}</p>
        </div>
        <div className="wide-box data-refreshed">
          <p className="info-label">Data Refreshed by Chess.com</p>
          <p className="info-value" style={{ fontWeight: 500 }}>{formatLastModified(lastModified)}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;

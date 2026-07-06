import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDaysCount, setActiveDaysCount] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  const handleSearch = async () => {
    try {
      let gameCount = 0;
      let totalGames = 0;
      const activeDays = new Set();

      setLoading(true);
      setError("");

      const [response, archivesResponse] = await Promise.all([
        fetch(`https://api.chess.com/pub/player/${username}`),
        fetch(`https://api.chess.com/pub/player/${username}/games/archives`)
      ]);

      if (!response.ok || !archivesResponse.ok) {
        throw new Error("User not found");
      }

      const profileData = await response.json();
      console.log('profile Data');
      console.log(profileData);



      const archivesData = await archivesResponse.json();
      const archiveResponses = await Promise.all(
        archivesData.archives.map((url) => fetch(url))
      );

      // console.log('game data');
      // console.log(archivesData);
      // console.log('length of archive : ', archivesData.archives.length);

      const archiveJsons = await Promise.all(
        archiveResponses.map((response) => response.json())
      );


      for (const archive of archiveJsons) {
        gameCount += archive.games.length;
        for (const game of archive.games) {
          const date = new Date(
            game.end_time * 1000
          ).toDateString();

          activeDays.add(date);
        }
      }
      // console.log(activeDays.size);
      setActiveDaysCount(activeDays.size);
      setTotalGames(gameCount);
      const timeClassCount = {};

      for (const archive of archiveJsons) {
        for (const game of archive.games) {
          const type = game.time_class;

          timeClassCount[type] =
            (timeClassCount[type] || 0) + 1;
        }
      }

      console.log(timeClassCount);
      const rulesCount = {};

      for (const archive of archiveJsons) {
        // for (const game of archive.games) {
        //   const rule = game.rules;

        //   rulesCount[rule] =
        //     (rulesCount[rule] || 0) + 1;
        // }
        // console.log('let"s see what happen')
        // for (const archive of archiveJsons) {
        //   for (const game of archive.games) {
        //     if (game.rules !== "chess") {
        //       console.log(game.rules, game.end_time);
        //     }
        //   }
        // }
      }
      console.log('total chess games :')
      for (const archive of archiveJsons) {
        for (const game of archive.games) {
          if (game.rules === "chess") {
            totalGames++;
          }
        }
      }
      let count = 0;
      for (const archive of archiveJsons) {
        for (const game of archive.games) {
          // console.log(count++);
          if (game.rules !== "chess") {
            console.log(game.rules);
          }
        }
      }

      
      // console.log(totalGames);

      // console.log(rulesCount);


      setPlayer(profileData);
    } catch (err) {
      setPlayer(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ChessDaysCount</h1>
      <input
        type="text"
        placeholder="Enter Chess.com username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <p>Username: {username}</p>
      <button onClick={handleSearch}>
        Search
      </button>
      {player && (
        <div>
          <h2>{player.username}</h2>

          <img
            src={player.avatar}
            alt="Profile"
            width="150"
          />

          <p>Name: {player.name}</p>

          <p>Followers: {player.followers}</p>

          <p>
            Joined:
            {new Date(
              player.joined * 1000
            ).toLocaleDateString()}
          </p>

          <p>Status: {player.status}</p>
          <p>Active Days: {activeDaysCount}</p>
          <p>Total Games: {totalGames}</p>
        </div>
      )}

    </div>
  );
}

export default App;

export const gameDaysCount = (archiveJsons) => {
  let archivedGamesCount = 0;

  const activeDays = new Set();

  for (const archive of archiveJsons) {

    if (!archive.games) continue;

    archivedGamesCount += archive.games.length;

    for (const game of archive.games) {
      activeDays.add(
        new Date(
          game.end_time * 1000
        ).toDateString()
      );
    }
  }

  return {
    totalGames: archivedGamesCount,
    activeDays: activeDays.size,
  };
};
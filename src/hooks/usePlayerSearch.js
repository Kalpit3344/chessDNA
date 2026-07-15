import { useState } from "react";

import {
  getPlayer,
  getArchives,
  getArchiveGames,
} from "../services/ChessApi";

import { gameDaysCount } from "../utils/gameDaysCount";

export function usePlayerSearch() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    activeDays: 0,
    totalGames: 0,
    todayGames: 0,
    todayWins: 0,
    todayLosses: 0,
    todayDraws: 0,
    todayWinRate: 0,
    todayLossRate: 0,
    todayDrawRate: 0,
  });
  const [archiveJsons, setArchiveJsons] = useState([]);
  const [lastModified, setLastModified] = useState(null);

  const normalizeResult = (result) => String(result || "").toLowerCase().trim();

  const isDrawResult = (result) => {
    const normalized = normalizeResult(result);
    return [
      "agreed",
      "repetition",
      "stalemate",
      "insufficient",
      "timevsinsufficient",
      "draw",
    ].includes(normalized);
  };

  const timeClassMap = {
    bullet: "bullet",
    blitz: "blitz",
    rapid: "rapid",
  };

  const getGamesByDate = (dateISO, format = null) => {
    if (!archiveJsons || archiveJsons.length === 0) return [];
    const normalizedFormat = format ? String(format).toLowerCase() : null;
    const targetFormat = normalizedFormat && timeClassMap[normalizedFormat]
      ? timeClassMap[normalizedFormat]
      : normalizedFormat;
    const results = [];
    for (const archive of archiveJsons) {
      if (!archive.games) continue;
      for (const game of archive.games) {
        const gameDateISO = new Date((game.end_time || 0) * 1000)
          .toISOString()
          .slice(0, 10);
        if (gameDateISO !== dateISO) continue;

        const timeClass = String(game.time_class || "").toLowerCase();
        if (targetFormat && targetFormat !== timeClass) continue;

        const outcome = getPlayerOutcome(game, (player && player.username) || "");

        results.push({
          white: {
            username: game.white?.username || "",
            rating: game.white?.rating || null,
          },
          black: {
            username: game.black?.username || "",
            rating: game.black?.rating || null,
          },
          url: game.url || game.pgn || "",
          end_time: game.end_time,
          outcome,
        });
      }
    }
    return results;
  };

  const getPlayerOutcome = (game, username) => {
    const playerUsername = String(username || "").toLowerCase().trim();
    const whiteName = String(game.white?.username || "").toLowerCase();
    const blackName = String(game.black?.username || "").toLowerCase();
    const isWhite = whiteName === playerUsername;
    const isBlack = blackName === playerUsername;
    if (!isWhite && !isBlack) return null;

    const result = normalizeResult(
      isWhite ? game.white?.result : game.black?.result
    );

    if (result === "win") return "win";
    if (isDrawResult(result)) return "draw";
    return "loss";
  };

  const calculateTodayStats = (archiveJsons, username) => {
    const today = new Date().toDateString();
    const todayStats = {
      todayGames: 0,
      todayWins: 0,
      todayLosses: 0,
      todayDraws: 0,
      todayWinRate: 0,
      todayLossRate: 0,
      todayDrawRate: 0,
    };

    for (const archive of archiveJsons) {
      if (!archive.games) continue;

      for (const game of archive.games) {
        const endDate = new Date((game.end_time || 0) * 1000).toDateString();
        if (endDate !== today) continue;

        const outcome = getPlayerOutcome(game, username);
        if (!outcome) continue;

        todayStats.todayGames += 1;
        if (outcome === "win") todayStats.todayWins += 1;
        else if (outcome === "draw") todayStats.todayDraws += 1;
        else todayStats.todayLosses += 1;
      }
    }

    if (todayStats.todayGames > 0) {
      todayStats.todayWinRate = Math.round(
        (todayStats.todayWins / todayStats.todayGames) * 100
      );
      todayStats.todayLossRate = Math.round(
        (todayStats.todayLosses / todayStats.todayGames) * 100
      );
      todayStats.todayDrawRate = Math.round(
        (todayStats.todayDraws / todayStats.todayGames) * 100
      );
    }

    return todayStats;
  };

  const searchPlayer = async (username) => {

    if (!username.trim()) {
      setError("Enter a username");
      return;
    }
    try {
      setLoading(true);
      setError("");

      const [profileData, archivesData] =
        await Promise.all([
          getPlayer(username),
          getArchives(username),
        ]);

      const archiveJsons = await getArchiveGames(archivesData.archives);

      setArchiveJsons(archiveJsons);

      const {
        totalGames,
        activeDays,
      } = gameDaysCount(archiveJsons);

      const todayResults = calculateTodayStats(archiveJsons, username);

      setPlayer(profileData);
      // capture Last-Modified header if present on profile response
      const lm = profileData && profileData._lastModified ? profileData._lastModified : null;
      setLastModified(lm);

      setStats({
        totalGames,
        activeDays,
        ...todayResults,
      });


    } catch (err) {
      setPlayer(null);

      setStats({
        activeDays: 0,
        totalGames: 0,
        todayGames: 0,
        todayWins: 0,
        todayLosses: 0,
        todayDraws: 0,
        todayWinRate: 0,
        todayLossRate: 0,
        todayDrawRate: 0,
      });
      setLastModified(null);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    player,
    stats,
    loading,
    error,
    searchPlayer,
    getGamesByDate,
    lastModified,
  };
}
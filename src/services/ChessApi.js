const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
const cacheStore = {
  player: new Map(),
  archives: new Map(),
  archiveGames: new Map(),
};

const getCached = (store, key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value;
};

const setCached = (store, key, value) => {
  store.set(key, {
    value,
    expires: Date.now() + CACHE_TTL,
  });
};

const normalizeUsername = (username) => String(username || "").trim().toLowerCase();

const attachLastModified = (json, lastModified) => {
  try {
    Object.defineProperty(json, "_lastModified", {
      value: lastModified,
      enumerable: false,
      writable: false,
    });
  } catch (e) {
    json._lastModified = lastModified;
  }
  return json;
};

//fetchs player's username
export const getPlayer = async (username) => {
  const normalized = normalizeUsername(username);
  const cached = getCached(cacheStore.player, normalized);
  if (cached) return cached;

  const useProxy = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_USE_PROXY === "true";

  let profile;
  let lastModified = null;

  if (useProxy) {
    const proxyUrl = `http://localhost:4000/player/${encodeURIComponent(normalized)}`;
    const response = await fetch(proxyUrl);
    if (response.status === 404) {
      throw new Error("User not found");
    }
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const body = await response.json();
    profile = body && body.profile ? body.profile : body;
    lastModified = body && body.lastModified ? body.lastModified : null;
  } else {
    const response = await fetch(`https://api.chess.com/pub/player/${normalized}`);
    if (response.status === 404) {
      throw new Error("User not found");
    }
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    lastModified = response.headers.get("last-modified") || null;
    profile = await response.json();
  }

  const result = attachLastModified(profile, lastModified);
  setCached(cacheStore.player, normalized, result);
  return result;
};
// fetchs player's game aarchive
export const getArchives = async (username) => {
  const normalized = normalizeUsername(username);
  const cached = getCached(cacheStore.archives, normalized);
  if (cached) return cached;

  const response = await fetch(
    `https://api.chess.com/pub/player/${normalized}/games/archives`
  );

  if (response.status === 404) {
    throw new Error("User not found");
  }

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  const result = await response.json();
  setCached(cacheStore.archives, normalized, result);
  return result;
};
// Fetch all monthly archive URLs in parallel
export const getArchiveGames = async (archives) => {
  const cacheKey = JSON.stringify(archives);
  const cached = getCached(cacheStore.archiveGames, cacheKey);
  if (cached) return cached;

  const responses = await Promise.all(
    archives.map((url) => fetch(url))
  );
  responses.forEach((response) => {
    if (!response.ok) {
      throw new Error(
        "Failed to load archives"
      );
    }
  });

  const result = await Promise.all(
    responses.map((response) => response.json())
  );
  setCached(cacheStore.archiveGames, cacheKey, result);
  return result;
};  
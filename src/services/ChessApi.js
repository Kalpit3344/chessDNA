
//fetchs player's username
export const getPlayer = async (username) => {
  const useProxy = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_PROXY === 'true';

  if (useProxy) {
    // Expect proxy to return { profile, lastModified }
    const proxyUrl = `http://localhost:4000/player/${encodeURIComponent(username)}`;
    const response = await fetch(proxyUrl);
    if (response.status === 404) {
      throw new Error("User not found");
    }
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const body = await response.json();
    const profile = body && body.profile ? body.profile : body;
    const lastModified = body && body.lastModified ? body.lastModified : null;
    try {
      Object.defineProperty(profile, "_lastModified", {
        value: lastModified,
        enumerable: false,
        writable: false,
      });
    } catch (e) {
      profile._lastModified = lastModified;
    }
    return profile;
  }

  // default: direct fetch from Chess.com (may not expose headers due to CORS)
  const response = await fetch(`https://api.chess.com/pub/player/${username}`);
  if (response.status === 404) {
    throw new Error("User not found");
  }
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  const lastModified = response.headers.get("last-modified") || null;
  const json = await response.json();
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
// fetchs player's game aarchive
export const getArchives = async (username) => {
  const response = await fetch(
    `https://api.chess.com/pub/player/${username}/games/archives`
  );

  if (response.status === 404) {
    throw new Error("User not found");
  }

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response.json();
};
// Fetch all monthly archive URLs in parallel
export const getArchiveGames = async (archives) => {


  // Send requests to every archive URL simultaneously
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

  // Convert all responses into JSON and return them
  return Promise.all(
    responses.map((response) => response.json())
  );
};  
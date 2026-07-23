export default async function handler(req, res) {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
        return res.status(400).json({ message: "Missing username" });
    }

    try {
        const r = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(username)}/games/archives`);
        if (r.status === 404) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!r.ok) {
            return res.status(502).send(await r.text());
        }

        const body = await r.json();
        return res.status(200).json(body);
    } catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : "Internal server error" });
    }
}

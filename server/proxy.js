import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/player/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const r = await fetch(`https://api.chess.com/pub/player/${username}`);
        if (r.status === 404) return res.status(404).json({ message: "User not found" });
        if (!r.ok) return res.status(502).send(await r.text());
        const lastModified = r.headers.get("last-modified") || null;
        const profile = await r.json();
        res.json({ profile, lastModified });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/player/:username/games/archives", async (req, res) => {
    try {
        const username = req.params.username;
        const r = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
        if (r.status === 404) return res.status(404).json({ message: "User not found" });
        if (!r.ok) return res.status(502).send(await r.text());
        const body = await r.json();
        res.json(body);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/fetch", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url || typeof url !== "string") {
            return res.status(400).json({ message: "Missing url query parameter" });
        }
        const r = await fetch(url);
        if (r.status === 404) return res.status(404).json({ message: "Not found" });
        if (!r.ok) return res.status(502).send(await r.text());

        r.headers.forEach((value, key) => {
            const skip = [
                "transfer-encoding",
                "content-length",
                "connection",
                "keep-alive",
                "upgrade",
            ];
            if (!skip.includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        });

        const body = await r.text();
        res.send(body);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Proxy listening on http://localhost:${port}`));

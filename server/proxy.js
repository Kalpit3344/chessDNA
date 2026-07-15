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

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Proxy listening on http://localhost:${port}`));

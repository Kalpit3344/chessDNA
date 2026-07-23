export default async function handler(req, res) {
    const url = req.query.url;

    if (!url || typeof url !== "string") {
        return res.status(400).json({ message: "Missing url query parameter" });
    }

    try {
        const r = await fetch(url);
        if (r.status === 404) {
            return res.status(404).json({ message: "Not found" });
        }
        if (!r.ok) {
            return res.status(502).send(await r.text());
        }

        const contentType = r.headers.get("content-type");
        if (contentType) {
            res.setHeader("content-type", contentType);
        }

        const body = await r.text();
        return res.status(200).send(body);
    } catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : "Internal server error" });
    }
}

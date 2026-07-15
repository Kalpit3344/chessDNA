import "../styles/statscard.css";

function StatsCard({ title, value }) {
  const formatValue = (v) => {
    if (v === null || v === undefined) return "-";
    if (typeof v === "number") {
      const abs = Math.abs(v);
      if (abs >= 1000000) {
        return new Intl.NumberFormat("en", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(v);
      }
      return new Intl.NumberFormat("en").format(v);
    }
    // if it's a numeric string, try to parse
    const asNum = Number(String(v).replace(/,/g, ""));
    if (!Number.isNaN(asNum)) return new Intl.NumberFormat("en").format(asNum);
    return String(v);
  };

  return (
    <article className="stats-card">
      <p className="stats-card-title">{title}</p>
      <p className="stats-card-value">{formatValue(value)}</p>
    </article>
  );
}

export default StatsCard;

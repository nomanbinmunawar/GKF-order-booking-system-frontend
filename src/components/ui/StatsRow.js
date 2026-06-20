export default function StatsRow({ stats }) {
  // stats = [{ label, value }]
  return (
    <div className="stats-row">
      {stats.map(({ label, value }) => (
        <div className="stat-chip" key={label}>
          <div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

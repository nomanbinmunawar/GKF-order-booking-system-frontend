const FILTERS = [
  { key: 'today',     label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week',      label: 'This Week' },
  { key: 'custom',    label: 'Custom Range' },
  { key: 'all',       label: 'All Orders' },
];

export default function FilterBar({ filter, from, to, onFilter, onFrom, onTo }) {
  return (
    <div className="filter-bar">
      {FILTERS.map(f => (
        <button
          key={f.key}
          className={`filter-btn${filter === f.key ? ' active' : ''}`}
          onClick={() => onFilter(f.key)}
        >
          {f.label}
        </button>
      ))}

      {filter === 'custom' && (
        <div className="custom-range">
          <input
            type="date"
            className="date-input"
            value={from}
            onChange={e => onFrom(e.target.value)}
          />
          <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>to</span>
          <input
            type="date"
            className="date-input"
            value={to}
            onChange={e => onTo(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

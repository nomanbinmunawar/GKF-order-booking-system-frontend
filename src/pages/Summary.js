import { useNavigate }   from 'react-router-dom';
import { useSummary }    from '../hooks/useSummary';
import FilterBar  from '../components/ui/FilterBar';
import StatsRow   from '../components/ui/StatsRow';
import Spinner    from '../components/ui/Spinner';
import Alert      from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';

const FILTER_LABELS = {
  today:     "Today's",
  yesterday: "Yesterday's",
  week:      "This Week's",
  custom:    'Custom Range',
  all:       'All-Time',
};

export default function Summary() {
  const navigate = useNavigate();
  const {
    filter, from, to,
    setFrom, setTo, changeFilter,
    summary, meta,
    loading, error,
    reload,
  } = useSummary();

  const stats = [
    { label: 'Orders in Range', value: meta.totalOrders },
    { label: 'Unique Shops',    value: meta.totalShops  },
    { label: 'Products',        value: summary.length   },
    {
      label: 'Total Units',
      value: summary.reduce((s, p) => s + p.grandTotalQty, 0),
    },
  ];

  const headingLabel = FILTER_LABELS[filter] || '';

  return (
    <>
      <button className="back-link" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">{headingLabel} Summary</h1>
          <p className="page-subtitle">
            Aggregated product totals — grouped by product &amp; variant
          </p>
        </div>
        <button className="btn btn-secondary" onClick={reload} disabled={loading}>
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>

      <FilterBar
        filter={filter} from={from} to={to}
        onFilter={changeFilter} onFrom={setFrom} onTo={setTo}
      />

      {!loading && !error && summary.length > 0 && (
        <StatsRow stats={stats} />
      )}

      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : summary.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No data for this period"
          message="There are no orders in the selected date range. Try a different filter."
        />
      ) : (
        <div className="summary-grid">
          {summary.map(product => (
            <div className="summary-card card" key={product._id}>
              {/* Product header */}
              <div className="summary-card-header">
              
                <div>
                  <div className="summary-product-name">{product.productName}</div>
                  <div className="summary-product-meta">
                    {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
                    <span style={{ color: 'var(--color-accent)' }}>
                      {product.grandTotalQty} total units
                    </span>
                  </div>
                </div>
              </div>

              {/* Variant rows */}
              <div className="table-wrap" style={{ borderRadius: 0, border: 'none', borderTop: '1px solid var(--color-border)' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Variant</th>
                      <th style={{ textAlign: 'right' }}>Orders</th>
                      <th style={{ textAlign: 'right' }}>Total Qty</th>
                      <th style={{ width: 120 }}>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map(v => {
                      const pct = product.grandTotalQty > 0
                        ? Math.round((v.totalQty / product.grandTotalQty) * 100)
                        : 0;
                      return (
                        <tr key={v.variant}>
                          <td>
                            <span className="variant-badge">Rs-{v.variant}</span>
                          </td>
                          <td style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                            {v.orderCount}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>
                            {v.totalQty}
                          </td>
                          <td>
                            <div className="qty-bar-wrap">
                              <div
                                className="qty-bar"
                                style={{ width: `${pct}%` }}
                                title={`${pct}%`}
                              />
                              <span className="qty-bar-label">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grand total footer */}
              <div className="summary-card-footer">
                <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Grand Total</span>
                <span className="summary-grand-total">{product.grandTotalQty} units</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

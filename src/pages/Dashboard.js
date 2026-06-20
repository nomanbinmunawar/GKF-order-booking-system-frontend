import { useNavigate } from 'react-router-dom';
import { useOrders }   from '../hooks/useOrders';
import FilterBar  from '../components/ui/FilterBar';
import StatsRow   from '../components/ui/StatsRow';
import Spinner    from '../components/ui/Spinner';
import Alert      from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';

function formatTime(d) {
  return new Date(d).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    filter, from, to, page,
    setFrom, setTo, setPage,
    changeFilter,
    orders, total, totalPages,
    loading, error,
  } = useOrders();

  const stats = [
    { label: 'Total Orders', value: total },
    { label: 'On This Page',  value: orders.length },
    { label: 'Unique Shops',  value: new Set(orders.map(o => o.shopName)).size },
    { label: 'Total Items',   value: orders.reduce((s, o) => s + o.items.length, 0) },
  ];

  const todayLabel = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Dashboard</h1>
          <p className="page-subtitle">
            {filter === 'today' ? `Today — ${todayLabel}` : 'Orders'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/summary')}>
            📊 Summary
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/new-order')}>
            + New Order
          </button>
        </div>
      </div>

      <FilterBar
        filter={filter} from={from} to={to}
        onFilter={changeFilter} onFrom={setFrom} onTo={setTo}
      />

      {!loading && !error && <StatsRow stats={stats} />}

      {error && <Alert type="error">{error}</Alert>}

      <div className="card">
        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No orders found"
            message="No orders match the selected filter. Try a different date range or create a new order."
          />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Shop Name</th>
                    <th>Shopkeeper</th>
                    <th>Phone</th>
                    {filter !== 'today' && <th>Date</th>}
                    <th>Time</th>
                    <th>Items</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order._id}>
                      <td className="row-number">{(page - 1) * 50 + idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{order.shopName}</td>
                      <td>{order.shopKeeperName}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{order.phoneNumber}</td>
                      {filter !== 'today' && (
                        <td style={{ color: 'var(--color-text-muted)' }}>{formatDate(order.date)}</td>
                      )}
                      <td style={{ color: 'var(--color-text-muted)' }}>{formatTime(order.date)}</td>
                      <td>
                        <span className="badge badge-items">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/order/${order._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

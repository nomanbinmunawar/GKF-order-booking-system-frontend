import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import Spinner    from '../components/ui/Spinner';
import Alert      from '../components/ui/Alert';

export default function OrderDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetchOrderById(id)
      .then(res => setOrder(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !order) {
    return (
      <>
        <button className="back-link" onClick={() => navigate('/')}>← Back</button>
        <Alert type="error">{error || 'Order not found'}</Alert>
      </>
    );
  }

  const dateStr = new Date(order.date).toLocaleString('en-PK', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <>
      <button className="back-link" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">{order.shopName}</h1>
          <p className="page-subtitle">{dateStr}</p>
        </div>
        <span className="badge badge-items" style={{ fontSize: 13, padding: '6px 14px' }}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Shop Details */}
      <div className="card card-body" style={{ marginBottom: 20 }}>
        <div className="section-heading"><h3>Shop Information</h3></div>
        <div className="detail-info-grid">
          <div className="detail-field">
            <label>Shop Name</label>
            <div className="detail-value">{order.shopName}</div>
          </div>
          <div className="detail-field">
            <label>Shopkeeper Name</label>
            <div className="detail-value">{order.shopKeeperName}</div>
          </div>
          <div className="detail-field">
            <label>Phone Number</label>
            <div className="detail-value">{order.phoneNumber}</div>
          </div>
          <div className="detail-field">
            <label>Order Date &amp; Time</label>
            <div className="detail-value">{dateStr}</div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card card-body">
        <div className="section-heading"><h3>Order Items</h3></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Variant</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="row-number">{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{item.productName}</td>
                  <td><span className="variant-badge">Rs-{item.variant}</span></td>
                  <td style={{ fontWeight: 700 }}>
                    {item.qty}{' '}
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 12 }}>units</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

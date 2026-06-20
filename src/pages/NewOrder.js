import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import Alert from '../components/ui/Alert';

const EMPTY_ITEM = () => ({ productName: '', variant: '', qty: '' });

function validate(header, items) {
  const errors = {};
  if (!header.shopName.trim())       errors.shopName       = true;
  if (!header.shopKeeperName.trim()) errors.shopKeeperName = true;
  if (!header.phoneNumber.trim())    errors.phoneNumber    = true;

  const itemErrors = items.map(item => ({
    productName: !item.productName.trim(),
    variant:     !item.variant.trim(),
    qty:         !item.qty || Number(item.qty) < 1,
  }));

  const valid =
    Object.keys(errors).length === 0 &&
    itemErrors.every(e => !e.productName && !e.variant && !e.qty);

  return { errors, itemErrors, valid };
}

export default function NewOrder() {
  const navigate = useNavigate();

  const [header, setHeader] = useState({ shopName: '', shopKeeperName: '', phoneNumber: '' });
  const [items,  setItems]  = useState([EMPTY_ITEM()]);

  const [fieldErrors, setFieldErrors] = useState({});
  const [itemErrors,  setItemErrors]  = useState([{}]);
  const [submitError, setSubmitError] = useState('');
  const [loading,     setLoading]     = useState(false);

  const handleHeader = e => {
    const { name, value } = e.target;
    setHeader(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleItem = (idx, field, value) => {
    setItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
    setItemErrors(prev => {
      const next = [...prev];
      next[idx] = { ...(next[idx] || {}), [field]: false };
      return next;
    });
  };

  const addRow = () => {
    setItems(prev => [...prev, EMPTY_ITEM()]);
    setItemErrors(prev => [...prev, {}]);
  };

  const removeRow = idx => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== idx));
    setItemErrors(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const { errors, itemErrors: iErr, valid } = validate(header, items);
    if (!valid) {
      setFieldErrors(errors);
      setItemErrors(iErr);
      setSubmitError('Please fill in all required fields before saving.');
      return;
    }

    setLoading(true);
    setSubmitError('');
    try {
      await createOrder({
        shopName:       header.shopName.trim(),
        shopKeeperName: header.shopKeeperName.trim(),
        phoneNumber:    header.phoneNumber.trim(),
        items: items.map(i => ({
          productName: i.productName.trim(),
          variant:     i.variant.trim(),
          qty:         Number(i.qty),
        })),
      });
      navigate('/');
    } catch (err) {
      setSubmitError(err.message || 'Failed to save order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nowStr = new Date().toLocaleString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <>
      <button className="back-link" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">New Order</h1>
          <p className="page-subtitle">Fill shop details and add products below</p>
        </div>
      </div>

      <div className="card card-body">
        {/* ── Shop Info ─────────────────────────────── */}
        <div className="section-heading"><h3>Shop Information</h3></div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Shop Name *</label>
            <input
              className={`form-input${fieldErrors.shopName ? ' error' : ''}`}
              name="shopName"
              placeholder="e.g. Al-Noor General Store"
              value={header.shopName}
              onChange={handleHeader}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Shopkeeper Name *</label>
            <input
              className={`form-input${fieldErrors.shopKeeperName ? ' error' : ''}`}
              name="shopKeeperName"
              placeholder="e.g. Ahmed Raza"
              value={header.shopKeeperName}
              onChange={handleHeader}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              className={`form-input${fieldErrors.phoneNumber ? ' error' : ''}`}
              name="phoneNumber"
              placeholder="e.g. 0300-1234567"
              value={header.phoneNumber}
              onChange={handleHeader}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date &amp; Time</label>
            <input className="form-input readonly" value={nowStr} readOnly />
          </div>
        </div>

        {/* ── Order Items ───────────────────────────── */}
        <div className="section-heading">
          <h3>Order Items</h3>
          <button className="btn btn-secondary btn-sm" onClick={addRow}>+ Add Row</button>
        </div>

        <div className="items-table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Product Name *</th>
                <th style={{ width: 150 }}>Variant (Rs) *</th>
                <th style={{ width: 110 }}>Quantity *</th>
                <th style={{ width: 56 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="row-number">{idx + 1}</td>
                  <td>
                    <input
                      className={`item-input${itemErrors[idx]?.productName ? ' error' : ''}`}
                      placeholder="e.g. Laal Mirch"
                      value={item.productName}
                      onChange={e => handleItem(idx, 'productName', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className={`item-input${itemErrors[idx]?.variant ? ' error' : ''}`}
                      placeholder="e.g. 100"
                      value={item.variant}
                      onChange={e => handleItem(idx, 'variant', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className={`item-input${itemErrors[idx]?.qty ? ' error' : ''}`}
                      placeholder="0"
                      value={item.qty}
                      onChange={e => handleItem(idx, 'qty', e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeRow(idx)}
                      disabled={items.length === 1}
                      title="Remove row"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="add-row-footer">
            <button className="btn btn-secondary btn-sm" onClick={addRow}>
              + Add Another Product
            </button>
          </div>
        </div>

        {submitError && <Alert type="error">{submitError}</Alert>}

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/')} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : '✓ Save Order'}
          </button>
        </div>
      </div>
    </>
  );
}

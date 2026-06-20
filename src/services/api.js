const BASE_URL = process.env.REACT_APP_API_URL;
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

/** Build query string, omitting falsy values */
function qs(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

// ── Orders ─────────────────────────────────────────────────────────────────

export async function fetchOrders({ filter = 'today', from = '', to = '', page = 1, limit = 50 } = {}) {
  const query = qs({ filter, from, to, page, limit });
  const res   = await fetch(`${BASE_URL}/orders?${query}`);
  return handleResponse(res);
}

export async function fetchOrderById(id) {
  const res = await fetch(`${BASE_URL}/orders/${id}`);
  return handleResponse(res);
}

export async function createOrder(orderData) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(orderData),
  });
  return handleResponse(res);
}

export async function deleteOrder(id) {
  const res = await fetch(`${BASE_URL}/orders/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

// ── Summary / Aggregation ──────────────────────────────────────────────────

export async function fetchSummary({ filter = 'today', from = '', to = '' } = {}) {
  const query = qs({ filter, from, to });
  const res   = await fetch(`${BASE_URL}/orders/summary?${query}`);
  return handleResponse(res);
}

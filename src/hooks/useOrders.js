import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchOrders } from '../services/api';

/**
 * useOrders — encapsulates filter/pagination state + data fetching.
 * Returns everything the Dashboard needs.
 */
export function useOrders() {
  const [filter, setFilter]     = useState('today');
  const [from,   setFrom]       = useState('');
  const [to,     setTo]         = useState('');
  const [page,   setPage]       = useState(1);

  const [orders,     setOrders]     = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  // Abort controller ref to cancel stale requests
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    // Skip custom filter until both dates are set
    if (filter === 'custom' && (!from || !to)) return;

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError('');
    try {
      const res = await fetchOrders({ filter, from, to, page, limit: 50 });
      setOrders(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, from, to, page]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 on filter change
  const changeFilter = useCallback((f) => {
    setFilter(f);
    setFrom('');
    setTo('');
    setPage(1);
  }, []);

  return {
    filter, from, to, page,
    setFrom, setTo, setPage,
    changeFilter,
    orders, total, totalPages,
    loading, error,
    reload: load,
  };
}

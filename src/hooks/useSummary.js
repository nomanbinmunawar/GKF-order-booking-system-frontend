import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSummary } from '../services/api';

export function useSummary() {
  const [filter, setFilter] = useState('today');
  const [from,   setFrom]   = useState('');
  const [to,     setTo]     = useState('');

  const [summary, setSummary] = useState([]);
  const [meta,    setMeta]    = useState({ totalOrders: 0, totalShops: 0 });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const abortRef = useRef(null);

  const load = useCallback(async () => {
    if (filter === 'custom' && (!from || !to)) return;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError('');
    try {
      const res = await fetchSummary({ filter, from, to });
      setSummary(res.data);
      setMeta(res.meta);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, from, to]);

  useEffect(() => { load(); }, [load]);

  const changeFilter = useCallback((f) => {
    setFilter(f);
    setFrom('');
    setTo('');
  }, []);

  return {
    filter, from, to,
    setFrom, setTo, changeFilter,
    summary, meta,
    loading, error,
    reload: load,
  };
}

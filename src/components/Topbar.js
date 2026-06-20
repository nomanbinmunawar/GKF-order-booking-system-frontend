import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <Link to="/" className="topbar-brand">
       
        <span className="brand-name">Green Karachi<span> Foods</span></span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          to="/"
          className={`topbar-nav-link${pathname === '/' ? ' active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/summary"
          className={`topbar-nav-link${pathname === '/summary' ? ' active' : ''}`}
        >
          📊 Summary
        </Link>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/new-order')}>
          + New Order
        </button>
      </nav>
    </header>
  );
}

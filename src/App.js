import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Topbar     from './components/Topbar';
import Dashboard  from './pages/Dashboard';
import NewOrder   from './pages/NewOrder';
import OrderDetail from './pages/OrderDetail';
import Summary    from './pages/Summary';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Topbar />
        <main className="main-content">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/new-order"  element={<NewOrder />} />
            <Route path="/order/:id"  element={<OrderDetail />} />
            <Route path="/summary"    element={<Summary />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

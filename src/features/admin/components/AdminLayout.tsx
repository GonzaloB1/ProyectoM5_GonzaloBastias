import { Link, Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <Link to="/admin/products">Productos</Link>
        <Link to="/admin/orders">Órdenes</Link>
      </nav>
      <Outlet />
    </div>
  );
}
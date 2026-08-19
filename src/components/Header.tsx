import { Link } from "react-router-dom";
import { useCart } from "../features/cart/hooks/useCart";
import { useAuth } from "../features/auth/hooks/useAuth";
import { logout } from "../features/auth/services/authService";

export function Header() {
  const { itemCount } = useCart();
  const { firebaseUser, role } = useAuth();

  return (
    <header>
      <Link to="/">Catálogo</Link>

      {firebaseUser && <Link to="/orders">Mis órdenes</Link>}
      {role === "admin" && <Link to="/admin/products">Panel Admin</Link>}

      <Link to="/cart">Carrito ({itemCount})</Link>

      {firebaseUser ? (
        <button onClick={() => logout()}>Cerrar sesión</button>
      ) : (
        <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </header>
  );
}
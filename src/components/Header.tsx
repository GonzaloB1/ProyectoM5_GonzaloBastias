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

      {role === "admin" && <Link to="/admin">Panel Admin</Link>}

      <Link to="/cart">Carrito ({itemCount})</Link>

      {firebaseUser && <button onClick={() => logout()}>Cerrar sesión</button>}
    </header>
  );
}
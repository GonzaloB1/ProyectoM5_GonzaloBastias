import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../features/cart/hooks/useCart";
import { useAuth } from "../features/auth/hooks/useAuth";
import { createOrder } from "../features/orders/services/orderService";

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!firebaseUser) return;

    setLoading(true);
    setError(null);

    try {
      await createOrder({
        userId: firebaseUser.uid,
        items,
        total,
      });
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError("No se pudo procesar tu compra. Intentá de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>No tenés productos en el carrito.</p>
        <Link to="/">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Confirmar compra</h1>

      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            {item.name} x{item.quantity} — ${(item.price * item.quantity).toLocaleString()}
          </li>
        ))}
      </ul>

      <p className="total">Total: ${total.toLocaleString()}</p>

      {error && <p className="error">{error}</p>}

      <button onClick={handleConfirm} disabled={loading}>
        {loading ? "Procesando..." : "Confirmar compra (pago simulado)"}
      </button>
    </div>
  );
}
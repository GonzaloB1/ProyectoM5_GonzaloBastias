import { Link } from "react-router-dom";
import { useCart } from "../features/cart/hooks/useCart";

export function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Carrito</h1>

      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            <img src={item.imageUrl} alt={item.name} />
            <span>{item.name}</span>
            <span>${item.price.toLocaleString()}</span>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
            />

            <span>${(item.price * item.quantity).toLocaleString()}</span>

            <button onClick={() => removeItem(item.productId)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <p className="total">Total: ${total.toLocaleString()}</p>

      <Link to="/checkout">Ir a checkout</Link>
    </div>
  );
}
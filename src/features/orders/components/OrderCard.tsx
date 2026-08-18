import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "../types/order";

export function OrderCard({ order }: { order: Order }) {
  return (
    <div className="order-card">
      <div className="order-header">
        <span>Orden #{order.id.slice(0, 8)}</span>
        <OrderStatusBadge status={order.status} />
      </div>

      <ul>
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.name} x{item.quantity}
          </li>
        ))}
      </ul>

      <p className="total">Total: ${order.total.toLocaleString()}</p>
    </div>
  );
}
import { OrderStatusSelect } from "./OrderStatusSelect";
import type { Order } from "../../orders/types/order";

export function AdminOrderRow({ order }: { order: Order }) {
  return (
    <tr>
      <td>#{order.id.slice(0, 8)}</td>
      <td>{order.userId.slice(0, 8)}</td>
      <td>{order.items.length} producto(s)</td>
      <td>${order.total.toLocaleString()}</td>
      <td>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </td>
    </tr>
  );
}
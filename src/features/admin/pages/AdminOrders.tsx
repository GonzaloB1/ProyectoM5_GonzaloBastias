import { useState, useEffect } from "react";
import { subscribeToAllOrders } from "../../orders/services/orderService";
import { OrderStatusFilter } from "../components/OrderStatusFilter";
import { AdminOrderRow } from "../components/AdminOrderRow";
import type { Order, OrderStatus } from "../../orders/types/order";

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  return (
    <div>
      <h1>Gestión de órdenes</h1>

      <OrderStatusFilter selected={statusFilter} onSelect={setStatusFilter} />

      {loading ? (
        <p>Cargando órdenes...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No hay órdenes {statusFilter ? "con este estado" : ""}.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Orden</th>
              <th>Usuario</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <AdminOrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
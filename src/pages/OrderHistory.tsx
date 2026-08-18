import { useState, useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { getUserOrders } from "../features/orders/services/orderService";
import { OrderCard } from "../features/orders/components/OrderCard";
import type { Order } from "../features/orders/types/order";

export function OrderHistory() {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;

    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      try {
        const result = await getUserOrders(firebaseUser!.uid);
        if (!cancelled) setOrders(result);
      } catch (err) {
        if (!cancelled) {
          setError("No se pudieron cargar tus órdenes.");
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [firebaseUser]);

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>Mis órdenes</h1>
      {orders.length === 0 ? (
        <p>Todavía no hiciste ninguna compra.</p>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}
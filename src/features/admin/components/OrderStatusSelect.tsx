import { useState } from "react";
import { updateOrderStatus } from "../../orders/services/orderService";
import type { OrderStatus } from "../../orders/types/order";

const STATUSES: OrderStatus[] = ["pending", "processing", "completed", "cancelled"];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [updating, setUpdating] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("No se pudo actualizar el estado de la orden.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      disabled={updating}
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}
import type { OrderStatus } from "../../orders/types/order";

const STATUSES: OrderStatus[] = ["pending", "processing", "completed", "cancelled"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  completed: "Completada",
  cancelled: "Cancelada",
};

interface OrderStatusFilterProps {
  selected: OrderStatus | null;
  onSelect: (status: OrderStatus | null) => void;
}

export function OrderStatusFilter({ selected, onSelect }: OrderStatusFilterProps) {
  return (
    <div className="order-status-filter">
      <button className={selected === null ? "active" : ""} onClick={() => onSelect(null)}>
        Todas
      </button>
      {STATUSES.map((status) => (
        <button
          key={status}
          className={selected === status ? "active" : ""}
          onClick={() => onSelect(status)}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}
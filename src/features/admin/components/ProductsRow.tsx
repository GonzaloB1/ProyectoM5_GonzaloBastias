import { useState } from "react";
import { deleteProduct } from "../../products/services/productService";
import { ProductForm } from "./ProductsForm";
import type { Product } from "../../products/types/products";

export function ProductRow({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`¿Eliminar "${product.name}"?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteProduct(product.id);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto.");
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <tr>
        <td colSpan={5}>
          <ProductForm existingProduct={product} onSuccess={() => setEditing(false)} />
          <button onClick={() => setEditing(false)}>Cancelar</button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td><img src={product.imageUrl} alt={product.name} width={50} /></td>
      <td>{product.name}</td>
      <td>${product.price.toLocaleString()}</td>
      <td>{product.stock}</td>
      <td>
        <button onClick={() => setEditing(true)}>Editar</button>
        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </td>
    </tr>
  );
}
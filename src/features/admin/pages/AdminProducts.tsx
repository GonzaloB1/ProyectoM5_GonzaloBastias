import { useState, useEffect } from "react";
import { subscribeToAllProducts } from "../../products/services/productService";
import { ProductForm } from "../components/ProductForm";
import { ProductRow } from "../components/ProductRow";
import type { Product } from "../../products/types/product";

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAllProducts((data) => {
      setProducts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Gestión de productos</h1>

      <button onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? "Cancelar" : "+ Nuevo producto"}
      </button>

      {showForm && (
        <ProductForm onSuccess={() => setShowForm(false)} />
      )}

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
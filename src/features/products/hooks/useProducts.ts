import { useState, useEffect } from "react";
import { getAllProducts, getProductsByCategory } from "../services/productService";
import type { Product } from "../../../types/product";

export function useProducts(category: string | null, searchTerm: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const result = category
          ? await getProductsByCategory(category)
          : await getAllProducts();

        if (!cancelled) {
          setProducts(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError("No se pudieron cargar los productos.");
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [category]);

 const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  return { products: filteredProducts, loading, error };
}
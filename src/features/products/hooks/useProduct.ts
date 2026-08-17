import { useState, useEffect } from "react";
import { getProductById } from "../services/productService";
import type { Product } from "../types/product";

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const result = await getProductById(id as string);
        if (!cancelled) {
          setProduct(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError("No se pudo cargar el producto.");
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}
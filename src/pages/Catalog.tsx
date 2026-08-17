import { useState } from "react";
import { useProducts } from "../features/products/hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import { ProductCard } from "../features/products/components/ProductCard";
import { ProductFilter } from "../features/products/components/ProductFilter";
import { SearchBar } from "../features/products/components/SearchBar";

export function Catalog() {
  const [category, setCategory] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const { products, loading, error } = useProducts(category, debouncedSearch);

  return (
    <div>
      <h1>Catálogo</h1>

      <SearchBar value={searchInput} onChange={setSearchInput} />
      <ProductFilter selected={category} onSelect={setCategory} />

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No se encontraron productos.</p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
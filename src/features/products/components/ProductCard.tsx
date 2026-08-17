import { Link } from "react-router-dom";
import type { Product } from "../types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price.toLocaleString()}</p>
      {product.stock === 0 && <span className="out-of-stock">Sin stock</span>}
    </Link>
  );
} 
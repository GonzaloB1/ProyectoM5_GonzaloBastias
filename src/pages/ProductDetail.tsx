import { useParams, Link } from "react-router-dom";
import { useProduct } from "../features/products/hooks/useProduct";

export function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>Producto no encontrado.</p>;

  return (
    <div>
      <Link to="/">← Volver al catálogo</Link>

      <img src={product.imageUrl} alt={product.name} />
      <h1>{product.name}</h1>
      <p className="price">${product.price.toLocaleString()}</p>
      <p>{product.description}</p>
      <p>Categoría: {product.category}</p>

      {product.stock > 0 ? (
        <p>Stock disponible: {product.stock}</p>
      ) : (
        <p className="out-of-stock">Sin stock</p>
      )}

      <button disabled={product.stock === 0}>
        Agregar al carrito (Etapa 4)
      </button>
    </div>
  );
}
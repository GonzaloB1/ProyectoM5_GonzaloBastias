import { useState, type FormEvent } from "react";
import { createProduct, updateProduct } from "../../products/services/productService";
import { uploadProductImage } from "../services/uploadService";
import type { Product } from "../../products/types/product";
import type { ProductFormData } from "../types/productsForm";

interface ProductFormProps {
  existingProduct?: Product;
  onSuccess: () => void;
}

const CATEGORIES = ["electronics", "clothing", "home", "sports"];

export function ProductForm({ existingProduct, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: existingProduct?.name ?? "",
    description: existingProduct?.description ?? "",
    price: existingProduct?.price?.toString() ?? "",
    category: existingProduct?.category ?? CATEGORIES[0],
    stock: existingProduct?.stock?.toString() ?? "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(existingProduct);

  function handleChange(field: keyof ProductFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isEditing && !imageFile) {
      setError("Seleccioná una imagen para el producto.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = existingProduct?.imageUrl ?? "";

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        imageUrl,
      };

      if (isEditing && existingProduct) {
        await updateProduct(existingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      onSuccess();
    } catch (err) {
      setError("No se pudo guardar el producto. Intentá de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? "Editar producto" : "Nuevo producto"}</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
      />

      <textarea
        placeholder="Descripción"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Precio"
        value={formData.price}
        onChange={(e) => handleChange("price", e.target.value)}
        required
        min="0"
      />

      <select
        value={formData.category}
        onChange={(e) => handleChange("category", e.target.value)}
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={(e) => handleChange("stock", e.target.value)}
        required
        min="0"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
      />

      {existingProduct?.imageUrl && !imageFile && (
        <img src={existingProduct.imageUrl} alt="Imagen actual" width={100} />
      )}

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}
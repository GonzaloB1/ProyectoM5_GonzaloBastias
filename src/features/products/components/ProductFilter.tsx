const CATEGORIES = ["electronics", "clothing", "home", "sports"];

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electrónica",
  clothing: "Ropa",
  home: "Hogar",
  sports: "Deportes",
};

interface ProductFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function ProductFilter({ selected, onSelect }: ProductFilterProps) {
  return (
    <div className="product-filter">
      <button
        className={selected === null ? "active" : ""}
        onClick={() => onSelect(null)}
      >
        Todas
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          className={selected === category ? "active" : ""}
          onClick={() => onSelect(category)}
        >
          {CATEGORY_LABELS[category]}
        </button>
      ))}
    </div>
  );
}
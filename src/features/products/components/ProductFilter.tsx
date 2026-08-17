const CATEGORIES = ["electronics", "clothing", "home", "sports"];

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
          {category}
        </button>
      ))}
    </div>
  );
}
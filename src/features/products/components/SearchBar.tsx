interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Buscar productos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
};

export function Select({ value, onChange, options }: SelectProps) {
  return (
    <select
      className="osc-form-control"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">-- Sélectionner --</option>

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
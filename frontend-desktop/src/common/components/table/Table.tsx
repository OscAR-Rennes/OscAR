import { useEffect, useState } from "react";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Action<T> = {
  label: string;
  onClick: (rows: T[]) => void;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  onRowSelect?: (rows: T[]) => void;
};

export default function Table<T>({ data, columns, actions = [], onRowSelect }: TableProps<T>) {
  const [selected, setSelected] = useState<T[]>([]);

  const toggleSelect = (row: T) => {
    const exists = selected.includes(row);
    const newSelection = exists
      ? selected.filter((r) => r !== row)
      : [...selected, row];

    setSelected(newSelection);
    onRowSelect?.(newSelection);
  };

  useEffect(() => {
    setSelected([]);
  }, [data]);

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>
              <input
                type="checkbox"
                checked={selected.includes(row)}
                onChange={() => toggleSelect(row)}
              />
            </td>

            {columns.map((col) => (
              <td key={String(col.key)}>
                {col.render ? col.render(row) : (row[col.key] as any)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
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
  renderActionButton?: () => React.ReactNode;
};

export default function Table<T>({ data, columns, actions = [], onRowSelect, renderActionButton }: TableProps<T>) {
  const [selected, setSelected] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

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
    setCurrentPage(1);
  }, [data, itemsPerPage]);

  return (
    <>
      <div className="table-row-count-wrapper" style={{ justifyContent: 'space-between' }}>
        <span className="table-row-count">
          Lignes : {data.length}
        </span>
        {renderActionButton && (
          <div>{renderActionButton()}</div>
        )}
      </div>
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
          {currentData.map((row, i) => (
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
      <div className="table-footer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
        <button
          className="table-btn"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <button
          className="table-btn"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
        <span>
          Afficher&nbsp;
          <select
            value={itemsPerPage}
            onChange={e => setItemsPerPage(Number(e.target.value))}
            style={{ marginLeft: 4, marginRight: 4 }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          &nbsp;par page
        </span>
      </div>
    </>
  );
}
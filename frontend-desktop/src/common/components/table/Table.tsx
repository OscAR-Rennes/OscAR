import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";


export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export type Action<T> = {
  label: string;
  onClick: (rows: T[]) => void;
};

type TableProps<T extends { id: string | number }> = {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  onRowSelect?: (rows: T[]) => void;
  renderActionButton?: () => React.ReactNode;
};


export default function Table<T extends { id: string | number }>({
  data,
  columns,
  actions = [],
  onRowSelect,
  renderActionButton,
}: TableProps<T>) {
  const location = useLocation();


  const [selectedIds, setSelectedIds] = useState<
    Array<T["id"]>
  >([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const totalPages = Math.max(
    1,
    Math.ceil(data.length / itemsPerPage)
  );

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);


  const toggleSelect = (row: T) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(row.id);
      const next = exists
        ? prev.filter((id) => id !== row.id)
        : [...prev, row.id];

      onRowSelect?.(data.filter((r) => next.includes(r.id)));

      return next;
    });
  };

  useEffect(() => {
    setSelectedIds([]);
    setCurrentPage(1);
  }, [data, itemsPerPage]);


  const renderCell = (
    row: T,
    column: Column<T>,
    columnIndex: number
  ) => {
    const value = column.render
      ? column.render(row)
      : (row[column.key] as React.ReactNode);

    if (columnIndex === 0) {
      return (
        <Link to={`${location.pathname}/${row.id}`}>
          {value}
        </Link>
      );
    }

    return value;
  };


  return (
    <>
      {/* Header */}
      <div
        className="table-row-count-wrapper"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span>Lignes : {data.length}</span>
        {renderActionButton?.()}
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th />
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentData.map((row) => (
            <tr key={row.id}>
              {/* Checkbox */}
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.id)}
                  onChange={() => toggleSelect(row)}
                />
              </td>

              {/* Data columns */}
              {columns.map((col, index) => (
                <td key={String(col.key)}>
                  {renderCell(row, col, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer / Pagination */}
      <div
        className="table-footer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginTop: 16,
        }}
      >
        <button
          className="table-btn"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((p) => Math.max(1, p - 1))
          }
        >
          Précédent
        </button>

        <span>
          Page {currentPage} / {totalPages}
        </span>

        <button
          className="table-btn"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(totalPages, p + 1)
            )
          }
        >
          Suivant
        </button>

        <span>
          Afficher&nbsp;
          <select
            value={itemsPerPage}
            onChange={(e) =>
              setItemsPerPage(Number(e.target.value))
            }
          >
            {[10, 15, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          &nbsp;par page
        </span>
      </div>
    </>
  );
}
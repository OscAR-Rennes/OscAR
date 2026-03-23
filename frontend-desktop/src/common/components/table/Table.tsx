import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const searchIcon = require("../../assets/icon/search.svg").default;

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");


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
  allItemsLabel?: string;
  allItemsPrefix?: string;
  serverPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
  onServerPaginationChange?: (pagination: {
    page: number;
    limit: number;
  }) => void;
};

type SortDirection = "asc" | "desc";


export default function Table<T extends { id: string | number }>({
  data = [],
  columns,
  actions = [],
  onRowSelect,
  renderActionButton,
  allItemsLabel,
  allItemsPrefix = "Tous les",
  serverPagination,
  onServerPaginationChange,
}: TableProps<T>) {
  const location = useLocation();
  const selectAllRef = useRef<HTMLInputElement>(null);


  const [selectedIds, setSelectedIds] = useState<
    Array<T["id"]>
  >([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(
    columns[0]?.key ?? null
  );
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const isServerPaginationEnabled =
    Boolean(serverPagination) &&
    typeof onServerPaginationChange === "function";

  const effectiveCurrentPage =
    isServerPaginationEnabled
      ? Math.max(1, serverPagination?.page ?? 1)
      : currentPage;

  const effectiveItemsPerPage =
    isServerPaginationEnabled
      ? Math.max(1, serverPagination?.limit ?? 15)
      : itemsPerPage;

  const normalizedSearchQuery = normalizeText(
    searchQuery.trim()
  );

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    if (!normalizedSearchQuery) {
      return data;
    }

    const isStatusQuery = [
      "actif",
      "active",
      "inactif",
      "inactive",
      "desactive",
    ].includes(normalizedSearchQuery);

    return data.filter((row) =>
      Object.values(row as Record<string, unknown>).some(
        (value) => {
          const searchableValues = [String(value ?? "")];

          if (typeof value === "boolean") {
            searchableValues.push(
              ...(value
                ? ["true", "active", "actif"]
                : [
                    "false",
                    "inactive",
                    "inactif",
                    "desactive",
                  ])
            );
          }

          const normalizedValue = normalizeText(
            String(value ?? "")
          );

          if (
            normalizedValue === "active" ||
            normalizedValue === "actif"
          ) {
            searchableValues.push("active", "actif");
          }

          if (
            normalizedValue === "inactive" ||
            normalizedValue === "inactif"
          ) {
            searchableValues.push(
              "inactive",
              "inactif",
              "desactive"
            );
          }

          const normalizedSearchableValues =
            searchableValues.map((searchableValue) =>
              normalizeText(searchableValue)
            );

          if (isStatusQuery) {
            return normalizedSearchableValues.some(
              (searchableValue) =>
                searchableValue === normalizedSearchQuery
            );
          }

          return normalizedSearchableValues.some(
            (searchableValue) =>
              searchableValue.includes(normalizedSearchQuery)
          );
        }
      )
    );
  }, [data, normalizedSearchQuery]);

  const sortedData = useMemo(() => {
    if (!sortKey) {
      return filteredData;
    }

    const getSortableValue = (value: unknown) => {
      if (typeof value === "number") {
        return value;
      }

      if (typeof value === "boolean") {
        return value ? "actif" : "inactif";
      }

      return normalizeText(String(value ?? ""));
    };

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = getSortableValue(a[sortKey]);
      const bValue = getSortableValue(b[sortKey]);

      let comparison = 0;

      if (
        typeof aValue === "number" &&
        typeof bValue === "number"
      ) {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(
          String(bValue),
          "fr",
          { sensitivity: "base" }
        );
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

    return sorted;
  }, [filteredData, sortDirection, sortKey]);

  const totalRows = isServerPaginationEnabled
    ? Math.max(0, serverPagination?.total ?? 0)
    : sortedData.length;


  const totalPages = Math.max(
    1,
    isServerPaginationEnabled
      ? serverPagination?.totalPages ??
          Math.ceil(totalRows / effectiveItemsPerPage)
      : Math.ceil(sortedData.length / effectiveItemsPerPage)
  );

  const currentData = useMemo(() => {
    if (isServerPaginationEnabled) {
      return sortedData;
    }

    const start = (effectiveCurrentPage - 1) * effectiveItemsPerPage;
    return sortedData.slice(start, start + effectiveItemsPerPage);
  }, [
    sortedData,
    isServerPaginationEnabled,
    effectiveCurrentPage,
    effectiveItemsPerPage,
  ]);

  const allRowIds = useMemo(
    () => sortedData.map((row) => row.id),
    [sortedData]
  );

  const selectedAllRowsCount = useMemo(
    () =>
      allRowIds.filter((id) => selectedIds.includes(id))
        .length,
    [allRowIds, selectedIds]
  );

  const isAllRowsSelected =
    allRowIds.length > 0 &&
    selectedAllRowsCount === allRowIds.length;

  const isSomeRowsSelected =
    selectedAllRowsCount > 0 && !isAllRowsSelected;


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

  const toggleSelectAllRows = () => {
    setSelectedIds((prev) => {
      const next = isAllRowsSelected ? [] : allRowIds;

      onRowSelect?.(data.filter((r) => next.includes(r.id)));

      return next;
    });
  };

  const toggleSort = (columnKey: keyof T) => {
    if (!isServerPaginationEnabled) {
      setCurrentPage(1);
    }

    if (sortKey === columnKey) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
      return;
    }

    setSortKey(columnKey);
    setSortDirection("asc");
  };

  useEffect(() => {
    setSelectedIds([]);

    if (!isServerPaginationEnabled) {
      setCurrentPage(1);
    }
  }, [data, itemsPerPage, isServerPaginationEnabled]);

  useEffect(() => {
    if (!isServerPaginationEnabled) {
      setCurrentPage(1);
    }
  }, [searchQuery, isServerPaginationEnabled]);

  useEffect(() => {
    if (!columns.length) {
      setSortKey(null);
      return;
    }

    const hasCurrentSortKey = sortKey
      ? columns.some((column) => column.key === sortKey)
      : false;

    if (!hasCurrentSortKey) {
      setSortKey(columns[0].key);
      setSortDirection("asc");
    }
  }, [columns, sortKey]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        isSomeRowsSelected;
    }
  }, [isSomeRowsSelected]);


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

  const goToPage = (nextPage: number) => {
    if (isServerPaginationEnabled) {
      onServerPaginationChange?.({
        page: nextPage,
        limit: effectiveItemsPerPage,
      });
      return;
    }

    setCurrentPage(nextPage);
  };

  const handleItemsPerPageChange = (nextLimit: number) => {
    if (isServerPaginationEnabled) {
      onServerPaginationChange?.({
        page: 1,
        limit: nextLimit,
      });
      return;
    }

    setItemsPerPage(nextLimit);
  };


  return (
    <>
      <div className="container">
        {/* Header */}
        <div className="table-row-count-wrapper">
          {allItemsLabel ? (
            <span className="table-all-items-label">
              {`${allItemsPrefix} ${allItemsLabel}`}
            </span>
          ) : null}

          <div className="table-header-actions">
            {renderActionButton?.()}

            <label className="table-search-wrapper">
              <img
                src={searchIcon}
                alt="Rechercher"
                className="table-search-icon"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Rechercher"
                className="table-search-input"
              />
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="table-content">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={isAllRowsSelected}
                    onChange={toggleSelectAllRows}
                    aria-label="Sélectionner toutes les lignes"
                  />
                </th>
                {columns.map((col) => (
                  <th key={String(col.key)}>
                    <button
                      type="button"
                      className="table-sort-button"
                      onClick={() => toggleSort(col.key)}
                    >
                      <span>{col.label}</span>
                      {sortKey === col.key ? (
                        <span className="table-sort-arrow">
                          {sortDirection === "asc"
                            ? "↓"
                            : "↑"}
                        </span>
                      ) : null}
                    </button>
                  </th>
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
        </div>

        {/* Footer / Pagination */}
        <div className="table-footer">
          <span className="table-row-count">
            Lignes : {isServerPaginationEnabled ? totalRows : filteredData.length}
          </span>

          <div className="table-pagination-actions">
            <button
              className="table-pagination-btn"
              disabled={effectiveCurrentPage === 1}
              onClick={() =>
                goToPage(Math.max(1, effectiveCurrentPage - 1))
              }
            >
              Précédent
            </button>

            <span>
              Page {effectiveCurrentPage} / {totalPages}
            </span>

            <button
              className="table-pagination-btn"
              disabled={effectiveCurrentPage === totalPages}
              onClick={() =>
                goToPage(
                  Math.min(totalPages, effectiveCurrentPage + 1)
                )
              }
            >
              Suivant
            </button>

            <span>
              Afficher&nbsp;
              <select
                value={effectiveItemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
              >
                {[15, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              &nbsp;par page
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
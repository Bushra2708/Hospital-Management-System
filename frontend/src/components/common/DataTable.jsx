import { useState, useMemo } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import LoadingSpinner from "./LoadingSpinner";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  pageSize = 10,
  emptyMessage = "No records found",
  actions,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = col.accessor ? row[col.accessor] : "";
        return String(val || "").toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div>
      {searchable && (
        <div style={{ marginBottom: 16, position: "relative", maxWidth: 320 }}>
          <FiSearch
            size={15}
            style={{
              position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "var(--text-muted)",
            }}
          />
          <input
            className="form-input"
            style={{ paddingLeft: 36, borderRadius: 10 }}
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      )}

      <div className="data-table-wrapper">
        {loading ? (
          <div style={{ padding: 60, display: "flex", justifyContent: "center" }}>
            <LoadingSpinner />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.accessor)}
                    style={{ cursor: col.sortable ? "pointer" : "default", userSelect: "none" }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {col.label}
                      {col.sortable && sortKey === col.accessor && (
                        <span style={{ opacity: 0.6 }}>{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </span>
                  </th>
                ))}
                {actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => (
                  <tr key={row._id || idx}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row) : row[col.accessor] ?? "—"}
                      </td>
                    ))}
                    {actions && <td>{actions(row)}</td>}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 16, color: "var(--text-secondary)", fontSize: 13,
          }}
        >
          <span>
            Showing {Math.min((page - 1) * pageSize + 1, sorted.length)}–
            {Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="icon-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ opacity: page === 1 ? 0.4 : 1 }}
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: pg === page ? "var(--gradient-primary)" : "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: pg === page ? "#fff" : "var(--text-secondary)",
                    cursor: "pointer", fontSize: 13, fontWeight: 500,
                  }}
                >
                  {pg}
                </button>
              );
            })}
            <button
              className="icon-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ opacity: page === totalPages ? 0.4 : 1 }}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

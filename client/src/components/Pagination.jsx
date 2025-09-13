import React from "react";
export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}
    >
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}>
        ← Prev
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        Next →
      </button>
    </div>
  );
}

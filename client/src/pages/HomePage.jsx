import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSuperheroes } from "../hooks/useSuperheroes.js";
import Pagination from "../components/Pagination.jsx";
import HeroCard from "../components/HeroCard.jsx";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useSuperheroes(page);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div style={{ color: "red" }}>{error.message}</div>;

  return (
    <div>
      <div className="section-header">
        <h1>Супергерої</h1>
        <Link to="/create" className="add-cta">
          ＋ Додати героя
        </Link>
      </div>

      <div className="grid">
        {data.items.map((it) => (
          <HeroCard key={it.id} item={it} />
        ))}
      </div>

      <div className="pager">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={data.page <= 1}
        >
          ← Prev
        </button>
        <span className="page-info">
          Page {data.page} / {data.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          disabled={data.page >= data.totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

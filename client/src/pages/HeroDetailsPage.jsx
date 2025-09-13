import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useHero } from "../hooks/useHero.js";
import { useDeleteHero } from "../hooks/useMutations.js";

export default function HeroDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useHero(id);
  const del = useDeleteHero();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  async function remove() {
    if (!confirm("Видалити героя?")) return;
    await del.mutateAsync(id);
    nav("/");
  }

  const photos = data.images_signed || [];

  return (
    <div className="hero-details" style={{ maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>{data.nickname}</h1>

      <div style={{ fontSize: 18, lineHeight: 1.6 }}>
        <p>
          <b>Real name:</b> {data.real_name || "—"}
        </p>
        <p>
          <b>Catch phrase:</b> {data.catch_phrase || "—"}
        </p>
        <p>
          <b>Origin:</b> {data.origin_description || "—"}
        </p>
        <p>
          <b>Superpowers:</b>{" "}
          {data.superpowers?.length ? data.superpowers.join(", ") : "—"}
        </p>
      </div>

      {photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 14,
            marginTop: 16,
          }}
        >
          {photos.map((u, i) => (
            <img
              key={i}
              src={u}
              alt={`img-${i}`}
              style={{ width: "100%", minHeight: 260, objectFit: "cover" }}
            />
          ))}
        </div>
      )}

      <div className="row" style={{ marginTop: 18, marginBottom: 20 }}>
        <Link to={`/edit/${id}`} className="btn btn-primary btn-sm">
          ✏️ Редагувати
        </Link>
        <button className="btn btn-secondary btn-sm" onClick={remove}>
          🗑 Видалити
        </button>
        <Link to="/" className="btn btn-ghost btn-sm">
          ← Назад
        </Link>
      </div>
    </div>
  );
}

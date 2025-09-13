import React from "react";
import { Link } from "react-router-dom";

export default function HeroCard({ item }) {
  return (
    <div className="card">
      {item.imageSigned ? (
        <img
          className="hero-thumb"
          src={item.imageSigned}
          alt={item.nickname}
        />
      ) : (
        <div
          className="hero-thumb"
          style={{
            display: "grid",
            placeItems: "center",
            color: "#9fb0c3",
            background: "#0f1622",
          }}
        >
          No image
        </div>
      )}
      <h3 style={{ marginTop: 10 }}>{item.nickname}</h3>
      <Link to={`/hero/${item.id}`} className="btn btn-secondary btn-sm">
        Деталі
      </Link>
    </div>
  );
}

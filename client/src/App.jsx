import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import HeroDetailsPage from "./pages/HeroDetailsPage.jsx";
import CreateEditPage from "./pages/CreateEditPage.jsx";

export default function App() {
  return (
    <div className="container">
      <header>
        <Link to="/" className="btn btn-ghost">
          🏠 Home
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hero/:id" element={<HeroDetailsPage />} />
        <Route path="/create" element={<CreateEditPage mode="create" />} />
        <Route path="/edit/:id" element={<CreateEditPage mode="edit" />} />
      </Routes>
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function HeroForm({
  initial,
  onCancel,
  onSaved,
  onSubmit,
  extraImages = [],
}) {
  const [form, setForm] = useState({
    nickname: "",
    real_name: "",
    origin_description: "",
    superpowers: "",
    catch_phrase: "",
    images: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        nickname: initial.nickname ?? "",
        real_name: initial.real_name ?? "",
        origin_description: initial.origin_description ?? "",
        superpowers:
          typeof initial.superpowers === "string"
            ? initial.superpowers
            : (initial.superpowers || []).join(", "),
        catch_phrase: initial.catch_phrase ?? "",
        images:
          typeof initial.images === "string"
            ? initial.images
            : (initial.images || []).join(", "),
      });
    } else {
      setForm({
        nickname: "",
        real_name: "",
        origin_description: "",
        superpowers: "",
        catch_phrase: "",
        images: "",
      });
    }
  }, [initial]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const payload = {
      nickname: form.nickname.trim(),
      real_name: form.real_name.trim() || null,
      origin_description: form.origin_description.trim() || null,
      catch_phrase: form.catch_phrase.trim() || null,
      superpowers: form.superpowers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: [
        ...form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        ...extraImages,
      ],
    };
    const saved = await onSubmit(payload);
    onSaved?.(saved);
  }

  return (
    <form onSubmit={submit} className="card">
      <h3>{initial ? "Редагувати героя" : "Створити героя"}</h3>

      <label>Nickname</label>
      <input value={form.nickname} onChange={set("nickname")} required />

      <label>Real name</label>
      <input value={form.real_name} onChange={set("real_name")} />

      <label>Origin</label>
      <textarea
        rows={4}
        value={form.origin_description}
        onChange={set("origin_description")}
      />

      <label>Superpowers (через кому)</label>
      <input value={form.superpowers} onChange={set("superpowers")} />

      <label>Catch phrase</label>
      <input value={form.catch_phrase} onChange={set("catch_phrase")} />

      <label>Images (paths у бакеті, через кому)</label>
      <input
        value={form.images}
        onChange={set("images")}
        placeholder="heroes/abc.png, heroes/def.jpg"
      />

      {extraImages.length > 0 && (
        <>
          <div className="hr"></div>
          <div className="muted">Додано з Upload: {extraImages.join(", ")}</div>
        </>
      )}

      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn" type="submit">
          Зберегти
        </button>
        <button className="btn" type="button" onClick={onCancel}>
          Скасувати
        </button>
      </div>
    </form>
  );
}

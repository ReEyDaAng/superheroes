import React, { useRef, useState } from "react";
import { useUploadImage } from "../hooks/useMutations.js";

export default function ImageUploader({ heroId, onUploaded }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const { mutateAsync, isPending } = useUploadImage();

  function choose() {
    inputRef.current?.click();
  }
  function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setPreview(URL.createObjectURL(f));
  }

  async function upload() {
    const f = inputRef.current?.files?.[0];
    if (!f) return;
    const data = await mutateAsync({ file: f, heroId });
    onUploaded?.(data.path);
    setFileName("");
    setPreview(null);
    inputRef.current.value = "";
  }

  return (
    <div className="row">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        hidden
      />
      <button type="button" className="btn btn-secondary" onClick={choose}>
        📁 Обрати зображення
      </button>
      <button
        type="button"
        className="btn btn-accent"
        onClick={upload}
        disabled={!fileName || isPending}
      >
        {isPending ? "Завантаження…" : "⬆️ Завантажити"}
      </button>
      {fileName && <span className="muted"> {fileName}</span>}
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: 120, height: 72, objectFit: "cover", marginLeft: 8 }}
        />
      )}
    </div>
  );
}

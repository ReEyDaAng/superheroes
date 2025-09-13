import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import HeroForm from "../components/HeroForm.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import { useCreateHero, useUpdateHero } from "../hooks/useMutations.js";
import { api } from "../libs/api.js";

export default function CreateEditPage({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" && id;

  const create = useCreateHero();
  const update = useUpdateHero();

  const [initial, setInitial] = useState(null);
  const [uploadedPaths, setUploadedPaths] = useState([]);

  useEffect(() => {
    (async () => {
      if (isEdit) {
        const hero = await api.get(id);
        setInitial({
          nickname: hero.nickname ?? "",
          real_name: hero.real_name ?? "",
          origin_description: hero.origin_description ?? "",
          superpowers: (hero.superpowers || []).join(", "),
          images: (hero.image_paths || []).join(", "),
          catch_phrase: hero.catch_phrase ?? "",
        });
      } else {
        setInitial(null);
      }
      setUploadedPaths([]);
    })();
  }, [isEdit, id]);

  function handleUploaded(path) {
    setUploadedPaths((prev) => [...prev, path]);
  }

  async function onSubmit(payload) {
    if (isEdit) {
      const saved = await update.mutateAsync({ id, payload });
      nav(`/hero/${id}`);
      return saved;
    } else {
      const saved = await create.mutateAsync(payload);
      nav(`/hero/${saved.id}`);
      return saved;
    }
  }

  function close() {
    nav(-1);
  }

  return (
    <Modal
      title={isEdit ? "Редагувати героя" : "Створити героя"}
      onClose={close}
      width={760}
    >
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="row">
          <ImageUploader
            heroId={isEdit ? id : undefined}
            onUploaded={handleUploaded}
          />
          {uploadedPaths.length > 0 && (
            <div className="muted">Додано: {uploadedPaths.join(", ")}</div>
          )}
        </div>
      </div>

      <HeroForm
        initial={initial}
        extraImages={uploadedPaths}
        onCancel={close}
        onSaved={() => {}}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}

import React, { useEffect } from "react";

export default function Modal({ title, onClose, children, width = 720 }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button
            className="icon-btn modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

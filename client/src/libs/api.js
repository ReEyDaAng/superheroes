const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  list: (page = 1, limit = 5) =>
    request(`/superheroes?page=${page}&limit=${limit}`),
  get: (id) => request(`/superheroes/${id}`),
  create: (payload) =>
    request(`/superheroes`, { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/superheroes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) => request(`/superheroes/${id}`, { method: "DELETE" }),
  upload: async (file, heroId) => {
    const form = new FormData();
    form.append("file", file);
    if (heroId) form.append("heroId", heroId);
    const res = await fetch(BASE + "/upload-image", {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },
};

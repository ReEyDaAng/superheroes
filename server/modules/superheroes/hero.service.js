import { supabase, BUCKET } from "../../config/supabase.js";
import { clampPagination } from "../../utils/pagination.js";

export async function list({ page, limit } = {}) {
  const { from, to, page: p, limit: l } = clampPagination(page, limit, 5);

  const {
    data: heroes,
    count,
    error,
  } = await supabase
    .from("superheroes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;

  const ids = (heroes ?? []).map((h) => h.id);
  const firstImages = new Map();

  if (ids.length) {
    const { data: images, error: e2 } = await supabase
      .from("hero_images")
      .select("hero_id, url, created_at")
      .in("hero_id", ids)
      .order("created_at", { ascending: true });
    if (e2) throw e2;

    for (const img of images ?? []) {
      if (!firstImages.has(img.hero_id)) {
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(img.url, 60 * 60 * 24);
        firstImages.set(img.hero_id, signed?.signedUrl ?? null);
      }
    }
  }

  const items = (heroes ?? []).map((h) => ({
    id: h.id,
    nickname: h.nickname,
    imageSigned: firstImages.get(h.id) ?? null,
  }));

  const total = count ?? 0;
  return {
    items,
    total,
    page: p,
    limit: l,
    totalPages: total === 0 ? 0 : Math.ceil(total / l),
  };
}

export async function getById(id) {
  const { data: hero, error } = await supabase
    .from("superheroes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;

  const { data: images } = await supabase
    .from("hero_images")
    .select("id, url")
    .eq("hero_id", id)
    .order("created_at", { ascending: true });

  const image_paths = (images ?? []).map((i) => i.url);
  const images_signed = [];
  for (const p of image_paths) {
    const { data: s } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(p, 60 * 60 * 24);
    if (s?.signedUrl) images_signed.push(s.signedUrl);
  }
  return { ...hero, image_paths, images_signed };
}

export async function create(payload) {
  const {
    nickname,
    real_name = null,
    origin_description = null,
    superpowers = [],
    catch_phrase = null,
    images = [],
  } = payload;

  const { data: inserted, error } = await supabase
    .from("superheroes")
    .insert([
      { nickname, real_name, origin_description, superpowers, catch_phrase },
    ])
    .select()
    .single();
  if (error) throw error;

  if (Array.isArray(images) && images.length) {
    const rows = images.map((url) => ({ hero_id: inserted.id, url }));
    const { error: e2 } = await supabase.from("hero_images").insert(rows);
    if (e2) throw e2;
  }
  return inserted;
}

export async function update(id, payload) {
  const {
    nickname,
    real_name = null,
    origin_description = null,
    superpowers = [],
    catch_phrase = null,
    images,
  } = payload;

  const { data: updated, error } = await supabase
    .from("superheroes")
    .update({
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  if (Array.isArray(images)) {
    await supabase.from("hero_images").delete().eq("hero_id", id);
    const rows = images.map((url) => ({ hero_id: id, url }));
    if (rows.length) {
      const { error: e2 } = await supabase.from("hero_images").insert(rows);
      if (e2) throw e2;
    }
  }
  return updated;
}

export async function remove(id) {
  const { error } = await supabase.from("superheroes").delete().eq("id", id);
  if (error) throw error;
}

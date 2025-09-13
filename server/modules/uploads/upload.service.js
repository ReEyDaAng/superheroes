import { supabase, BUCKET } from "../../config/supabase.js";

export async function uploadToStorage(file, heroId) {
  const ext = (file.originalname.split(".").pop() || "jpg").toLowerCase();
  const path = `heroes/${Date.now()}_${Math.random()
    .toString(16)
    .slice(2)}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });
  if (upErr) throw upErr;

  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24);
  if (signErr) throw signErr;

  const url = signed?.signedUrl;

  if (heroId) {
    const { error: e2 } = await supabase
      .from("hero_images")
      .insert({ hero_id: heroId, url: path });
    if (e2) throw e2;
  }

  return { url, path };
}

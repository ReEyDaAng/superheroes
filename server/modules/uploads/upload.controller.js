import * as uploadService from "./upload.service.js";

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      const e = new Error("file is required");
      e.status = 400;
      throw e;
    }
    const heroId = req.body.heroId || null;
    const result = await uploadService.uploadToStorage(req.file, heroId);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

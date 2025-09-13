import { jest, describe, test, expect } from "@jest/globals";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "http://localhost";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test";

jest.unstable_mockModule("../upload.service.js", () => ({
  uploadToStorage: jest.fn(async (_file, heroId) => ({
    path: "images/mock/pic.png",
    url: "https://cdn.test/images/mock/pic.png",
    signedUrl: "https://signed.test/images/mock/pic.png",
    record: { id: "img-1", hero_id: heroId },
  })),
  uploadImage: jest.fn(async ({ filename, heroId }) => ({
    path: `images/mock/${filename}`,
    url: `https://cdn.test/images/mock/${filename}`,
    signedUrl: `https://signed.test/images/mock/${filename}`,
    record: { id: "img-1", hero_id: heroId },
  })),
}));

const { default: app } = await import("../../../app.js");
const uploadSvc = await import("../upload.service.js");

const origError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = origError;
});

describe("POST /upload-image", () => {
  test("2xx + повертає об’єкт з url/signedUrl", async () => {
    const res = await request(app)
      .post("/upload-image")
      .field("heroId", "h1")
      .attach("file", Buffer.from("image-bytes"), "pic.png");

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    expect(res.body).toMatchObject({
      path: "images/mock/pic.png",
      url: "https://cdn.test/images/mock/pic.png",
      signedUrl: "https://signed.test/images/mock/pic.png",
      record: { id: "img-1", hero_id: "h1" },
    });
    expect(uploadSvc.uploadToStorage || uploadSvc.uploadImage).toBeDefined();
  });

  test("400, якщо файл відсутній", async () => {
    const res = await request(app).post("/upload-image").field("heroId", "h1");
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(String(res.text || res.body?.message || "")).toMatch(/file/i);
  });
});

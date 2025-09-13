import { jest, describe, test, expect, beforeEach } from "@jest/globals";

process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "http://localhost";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test";

const makeDbChain = () => ({
  insert: jest.fn(async () => ({ data: [{ id: "img-1" }], error: null })),
});
const makeStorageChain = () => ({
  upload: jest.fn(async () => ({
    data: { path: "heroes/abc.png" },
    error: null,
  })),
  createSignedUrl: jest.fn(async () => ({
    data: { signedUrl: "https://signed/abc.png" },
    error: null,
  })),
});

const dbChain = makeDbChain();
const storageChain = makeStorageChain();

jest.unstable_mockModule("../../../config/supabase.js", () => ({
  BUCKET: "images",
  supabase: {
    from: jest.fn(() => dbChain),
    storage: { from: jest.fn(() => storageChain) },
  },
}));

const { uploadToStorage } = await import("../upload.service.js");

const file = {
  originalname: "pic.png",
  mimetype: "image/png",
  buffer: Buffer.from("abc"),
};

describe("uploadToStorage()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageChain.upload.mockResolvedValue({
      data: { path: "heroes/abc.png" },
      error: null,
    });
    storageChain.createSignedUrl.mockResolvedValue({
      data: { signedUrl: "https://signed/abc.png" },
      error: null,
    });
    dbChain.insert.mockResolvedValue({ data: [{ id: "img-1" }], error: null });
  });

  test("завантажує у storage, підписує URL і створює запис у hero_images (з heroId)", async () => {
    const res = await uploadToStorage(file, "h1");

    expect(storageChain.upload).toHaveBeenCalledTimes(1);
    const [path, buf, opts] = storageChain.upload.mock.calls[0];
    expect(typeof path).toBe("string");
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(opts).toMatchObject({ contentType: "image/png", upsert: false });

    expect(storageChain.createSignedUrl).toHaveBeenCalledWith(
      expect.any(String),
      60 * 60 * 24
    );

    expect(dbChain.insert).toHaveBeenCalledWith({
      hero_id: "h1",
      url: expect.any(String),
    });

    expect(res).toMatchObject({
      url: "https://signed/abc.png",
      path: expect.stringMatching(/^heroes\//),
    });
  });

  test("не створює запис у hero_images, якщо heroId не переданий", async () => {
    await uploadToStorage(file, undefined);
    expect(dbChain.insert).not.toHaveBeenCalled();
  });

  test("кидає помилку, якщо storage.upload повернув помилку", async () => {
    storageChain.upload.mockResolvedValueOnce({
      data: null,
      error: new Error("upload failed"),
    });
    await expect(uploadToStorage(file, "h1")).rejects.toThrow(/upload failed/i);
  });

  test("кидає помилку, якщо createSignedUrl повернув помилку", async () => {
    storageChain.createSignedUrl.mockResolvedValueOnce({
      data: null,
      error: new Error("sign failed"),
    });
    await expect(uploadToStorage(file, "h1")).rejects.toThrow(/sign failed/i);
  });

  test("кидає помилку БД при insert", async () => {
    dbChain.insert.mockResolvedValueOnce({
      data: null,
      error: new Error("db insert fail"),
    });
    await expect(uploadToStorage(file, "h1")).rejects.toThrow(
      /db insert fail/i
    );
  });
});

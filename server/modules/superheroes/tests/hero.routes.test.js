import { jest, describe, test, expect } from "@jest/globals";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "http://localhost";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test";

const chain = {
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
};

jest.unstable_mockModule("../../../config/supabase.js", () => ({
  supabase: { from: jest.fn(() => chain) },
  BUCKET: "images",
}));

jest.unstable_mockModule("../hero.service.js", () => ({
  list: jest.fn(async () => ({
    items: [{ id: "1", nickname: "Mock" }],
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  })),
}));

const { default: app } = await import("../../../app.js");
const heroService = await import("../hero.service.js");

describe("GET /superheroes", () => {
  test("200 і валідна форма", async () => {
    const res = await request(app).get("/superheroes?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(heroService.list).toHaveBeenCalled();
  });
});

import { jest, describe, test, expect, beforeEach } from "@jest/globals";

process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "http://localhost";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test";

const makeChain = () => {
  const chain = {
    select: jest.fn(() => chain),
    order: jest.fn(() => chain),
    range: jest.fn(() => Promise.resolve({ data: [], count: 0, error: null })),
    eq: jest.fn(() => chain),
    in: jest.fn(() => chain),
  };
  return chain;
};

const chain = makeChain();
const supabaseMock = { from: jest.fn(() => chain) };

jest.unstable_mockModule("../../../config/supabase.js", () => ({
  supabase: supabaseMock,
  BUCKET: "images",
}));

const heroService = await import("../hero.service.js");

describe("hero.service list()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    chain.range.mockResolvedValue({ data: [], count: 0, error: null });
  });

  test("правильний range/order і пагінація", async () => {
    const page = 2,
      limit = 5,
      total = 13;
    const items = Array.from({ length: 5 }, (_, i) => ({
      id: `id-${i}`,
      nickname: `N-${i}`,
    }));

    chain.range.mockResolvedValueOnce({
      data: items,
      count: total,
      error: null,
    });

    const res = await heroService.list({ page, limit });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    expect(supabaseMock.from).toHaveBeenCalledWith("superheroes");
    expect(chain.select).toHaveBeenCalledWith("*", { count: "exact" });
    expect(chain.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(chain.range).toHaveBeenCalledWith(from, to);

    expect(res.items).toHaveLength(5);
    expect(res.page).toBe(2);
    expect(res.limit).toBe(5);
    expect(res.total).toBe(13);
    expect(res.totalPages).toBe(Math.ceil(total / limit));
  });

  test("порожній список → коректна відповідь", async () => {
    chain.range.mockResolvedValueOnce({ data: [], count: 0, error: null });

    const res = await heroService.list({ page: 1, limit: 10 });

    expect(res.items).toEqual([]);
    expect(res.total).toBe(0);
    expect(res.totalPages).toBe(0);
  });
});

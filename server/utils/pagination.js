export function clampPagination(
  pageRaw,
  limitRaw,
  defaultLimit = 5,
  maxLimit = 50
) {
  const page = Math.max(parseInt(pageRaw || 1, 10), 1);
  const limit = Math.min(
    Math.max(parseInt(limitRaw || defaultLimit, 10), 1),
    maxLimit
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { page, limit, from, to };
}

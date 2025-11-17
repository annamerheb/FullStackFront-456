export function paginate<T>(items: T[], page = 1, page_size = 10) {
  const start = (page - 1) * page_size;
  const results = items.slice(start, start + page_size);
  return {
    count: items.length,
    next: null,
    previous: null,
    results,
  };
}
export function avgRating(ratings: { value: number }[]) {
  if (!ratings.length) return 0;
  return ratings.reduce((a, r) => a + r.value, 0) / ratings.length;
}

/** One bounded page window shared by all framework adapters. */
export function getPaginationRange(totalPages: number, currentPage: number) {
  const total = Math.max(1, Number.isFinite(totalPages) ? Math.floor(totalPages) : 1);
  const current = Math.min(
    total,
    Math.max(1, Number.isFinite(currentPage) ? Math.floor(currentPage) : 1),
  );
  let start = current - 1;
  if (current <= 2) start = 1;
  else if (current >= total - 1) start = Math.max(1, total - 3);
  const pages = Array.from({ length: Math.min(4, total - start + 1) }, (_, index) => start + index);
  const end = pages.at(-1) ?? total;
  return {
    total,
    current,
    pages,
    leading: start > 1,
    trailing: end < total,
    leadingGap: start > 2,
    trailingGap: end < total - 1,
  };
}

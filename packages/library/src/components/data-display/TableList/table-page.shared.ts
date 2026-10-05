/** Client pagination is opt-in; server-paginated consumers keep their full supplied page. */
export function getTablePage(
  count: number,
  requestedPage: number,
  requestedSize: number,
  enabled: boolean,
) {
  const size = Number.isFinite(requestedSize) ? Math.max(1, Math.floor(requestedSize)) : 10;
  const totalPages = Math.max(1, Math.ceil(count / size));
  const page = Number.isFinite(requestedPage)
    ? Math.min(totalPages, Math.max(1, Math.floor(requestedPage)))
    : 1;
  const start = enabled ? (page - 1) * size : 0;
  return { page, totalPages, start, end: enabled ? Math.min(count, start + size) : count };
}

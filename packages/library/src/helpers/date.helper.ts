/**
 * Converts a parsable date string to ISO calendar date format.
 *
 * @param dateString - Source date string.
 * @returns Date in YYYY-MM-DD format or empty string.
 */
export function formatDateToISODateString(dateString: string | undefined): string {
  if (dateString === undefined || dateString === '') {
    return '';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const [isoDate] = date.toISOString().split('T');

  return isoDate ?? '';
}

export const formatDate = (
  dateString: string | Date | null | undefined
): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  // Check if the date is actually valid
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

/**
 * Formats for detailed view including time
 * Example: "Dec 27, 2025, 7:05 PM"
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

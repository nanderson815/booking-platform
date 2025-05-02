// Admin-configured blocked dates when no bookings are allowed
export const blockedDateRanges = [
  {
    name: "4th of July Week",
    startDate: "2025-07-01",
    endDate: "2025-07-07",
  },
  {
    name: "Labor Day Weekend",
    startDate: "2025-08-29",
    endDate: "2025-09-02",
  },
  {
    name: "Christmas & New Year",
    startDate: "2025-12-23",
    endDate: "2026-01-02",
  },
  // Add more blocked date ranges here as needed
];

// Helper function to check if a date is blocked
export function isDateBlocked(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0];
  
  return blockedDateRanges.some(range => {
    return dateStr >= range.startDate && dateStr <= range.endDate;
  });
}

// Helper to get blocked dates for current and next year
export function getBlockedDatesForYear(year: number) {
  return blockedDateRanges.map(range => ({
    ...range,
    startDate: range.startDate.replace(/\d{4}/, year.toString()),
    endDate: range.endDate.replace(/\d{4}/, year.toString()),
  }));
}
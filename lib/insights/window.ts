export function startOfDayUTC(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export function endOfDayUTC(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(23, 59, 59, 999);
  return x;
}

export function getWeekFor(date: Date): { weekStart: Date; weekEnd: Date } {
  const d = startOfDayUTC(date);
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  const weekStart = new Date(d);
  weekStart.setUTCDate(d.getUTCDate() - daysSinceMonday);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
}

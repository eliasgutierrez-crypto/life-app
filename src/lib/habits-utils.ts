export function isDueToday(habit: { frequency: string; timesPerWeek: number | null; daysOfWeek: number[] }, date: Date): boolean {
  if (habit.frequency === "DAILY") return true;
  if (habit.frequency === "SPECIFIC_DAYS") return habit.daysOfWeek.includes(date.getDay());
  return true;
}

export function streak(entries: Array<{ date: Date; completed: boolean }>, from = new Date()): number {
  let count = 0;
  const map = new Map(entries.map((entry) => [new Date(entry.date).toISOString().slice(0, 10), entry.completed]));
  const cursor = new Date(from);
  cursor.setHours(12, 0, 0, 0);
  for (let i = 0; i < 366; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (map.get(key)) count++;
    else if (count > 0) break;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function completionRate(entries: Array<{ completed: boolean }>, days: number): number {
  if (days <= 0) return 0;
  return Math.round((entries.filter((entry) => entry.completed).length / days) * 100);
}
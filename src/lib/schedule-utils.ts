export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes ?? 0);
}
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}
export function blockOverlaps(a: { startTime: number; endTime: number }, b: { startTime: number; endTime: number }): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime;
}
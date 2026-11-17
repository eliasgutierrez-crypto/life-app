export function isLowStock(item: { currentQty: unknown; minStock: unknown }): boolean {
  const current = Number(item.currentQty);
  const min = Number(item.minStock);
  return min > 0 && current < min;
}

export function isExpired(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
}

export function isExpiringSoon(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);
  const d = new Date(date);
  return d >= today && d <= in7Days;
}

export function formatQty(value: unknown): string {
  const n = Number(value);
  // 3 decimales max, sin ceros trailing
  return n.toLocaleString("es-MX", { maximumFractionDigits: 3 });
}
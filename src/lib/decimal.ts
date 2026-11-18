export function formatCurrency(value: unknown): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
}

export function parseDecimal(value: unknown): number {
  const parsed = typeof value === "string" ? value.replace(/,/g, "").trim() : value;
  const number = Number(parsed);
  return Number.isFinite(number) ? number : 0;
}
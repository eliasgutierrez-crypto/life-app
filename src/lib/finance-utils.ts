export function formatMoney(value: unknown): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value));
}

export function sumByType(items: Array<{ type: string; amount: unknown }>): Record<string, number> {
  return items.reduce<Record<string, number>>((totals, item) => {
    totals[item.type] = (totals[item.type] ?? 0) + Number(item.amount);
    return totals;
  }, {});
}

export function isExpense(type: string): boolean {
  return type === "EXPENSE" || type === "DEBT_PAYMENT";
}

export function isIncome(type: string): boolean {
  return type === "INCOME";
}
export function totalContributed(contributions: Array<{ amount: unknown }>): number {
  return contributions.reduce((sum, item) => sum + Number(item.amount), 0);
}
export function gainLoss(investment: { currentValue: unknown }, contributions: Array<{ amount: unknown }>): number {
  return Number(investment.currentValue) - totalContributed(contributions);
}
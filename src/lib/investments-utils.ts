export type InvestmentWithContributions = {
  currentValue: unknown;
  annualRate?: unknown | null;
  interestType?: string | null;
  contributions: Array<{ amount: unknown }>;
}

export function totalContributed(investment: Pick<InvestmentWithContributions, "contributions">): number {
  return investment.contributions.reduce((sum, item) => sum + Number(item.amount), 0);
}

export function currentGain(investment: InvestmentWithContributions): number {
  return Number(investment.currentValue) - totalContributed(investment);
}

export function currentGainPercent(investment: InvestmentWithContributions): number | null {
  const contributed = totalContributed(investment);
  return contributed > 0 ? (currentGain(investment) / contributed) * 100 : null;
}

export function expectedAnnualReturn(investment: InvestmentWithContributions): number | null {
  if (investment.annualRate == null) return null;
  return Number(investment.currentValue) * Number(investment.annualRate) / 100;
}

export function projectValue(investment: InvestmentWithContributions, years: number): number {
  const currentValue = Number(investment.currentValue);
  if (investment.annualRate == null) return currentValue;

  const annualRate = Number(investment.annualRate) / 100;
  if (investment.interestType === "SIMPLE") {
    return currentValue * (1 + annualRate * years);
  }
  return currentValue * Math.pow(1 + annualRate, years);
}
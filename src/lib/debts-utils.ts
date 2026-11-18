export type AmortizationRow = { number: number; dueDate: Date; amount: number; principal: number; interest: number };
export function amortizationTable(debt: { principal: unknown; annualRate: unknown; startDate: Date; termMonths: number }): AmortizationRow[] {
  const principal = Number(debt.principal);
  const monthlyRate = Number(debt.annualRate) / 100 / 12;
  const months = debt.termMonths;
  const payment = monthlyRate === 0
    ? principal / months
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  let balance = principal;
  return Array.from({ length: months }, (_, index) => {
    const interest = balance * monthlyRate;
    const principalPayment = Math.min(balance, payment - interest);
    balance = Math.max(0, balance - principalPayment);
    const dueDate = new Date(debt.startDate);
    dueDate.setMonth(dueDate.getMonth() + index + 1);
    return { number: index + 1, dueDate, amount: principalPayment + interest, principal: principalPayment, interest };
  });
}
import { prisma } from "@/lib/db";

const modelNames = [
  "Couple",
  "Debt",
  "DebtPayment",
  "Account",
  "Category",
  "Transaction",
  "CreditCard",
  "InstallmentPlan",
  "InstallmentPayment",
  "Habit",
  "HabitEntry",
  "Investment",
  "InvestmentContribution",
  "Recipe",
  "MealPlan",
  "MealPlanEntry",
  "PantryItem",
  "ScheduleBlock",
] as const;

export async function DatabaseModelCounts() {
  const counts = await Promise.all([
    prisma.couple.count(),
    prisma.debt.count(),
    prisma.debtPayment.count(),
    prisma.account.count(),
    prisma.category.count(),
    prisma.transaction.count(),
    prisma.creditCard.count(),
    prisma.installmentPlan.count(),
    prisma.installmentPayment.count(),
    prisma.habit.count(),
    prisma.habitEntry.count(),
    prisma.investment.count(),
    prisma.investmentContribution.count(),
    prisma.recipe.count(),
    prisma.mealPlan.count(),
    prisma.mealPlanEntry.count(),
    prisma.pantryItem.count(),
    prisma.scheduleBlock.count(),
  ]);

  return (
    <section aria-label="Registros por modelo" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {modelNames.map((name, index) => (
        <article
          className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          key={name}
        >
          <h2 className="text-sm font-medium text-zinc-600">{name}</h2>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{counts[index]}</p>
          <p className="mt-1 text-xs text-zinc-500">registros</p>
        </article>
      ))}
    </section>
  );
}

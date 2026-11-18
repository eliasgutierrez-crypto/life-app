import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

function atMidday(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

function addMonths(date: Date, months: number): Date {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return atMidday(copy);
}

async function main() {
  const couple = await prisma.couple.findFirst({
    where: { memberBId: { not: null } },
  });

  if (!couple) {
    throw new Error("Crea una pareja completa primero (dos usuarios unidos)");
  }

  const coupleId = couple.id;
  const now = atMidday(new Date());
  const monthStart = atMidday(new Date(now.getFullYear(), now.getMonth(), 1));

  await prisma.mealPlanEntry.deleteMany({});
  await prisma.mealPlan.deleteMany({ where: { coupleId } });
  await prisma.recipe.deleteMany({ where: { coupleId } });
  await prisma.scheduleBlock.deleteMany({ where: { coupleId } });
  await prisma.habitEntry.deleteMany({});
  await prisma.habit.deleteMany({ where: { coupleId } });
  await prisma.investmentContribution.deleteMany({});
  await prisma.investment.deleteMany({ where: { coupleId } });
  await prisma.debtPayment.deleteMany({});
  await prisma.debt.deleteMany({ where: { coupleId } });
  await prisma.installmentPayment.deleteMany({});
  await prisma.installmentPlan.deleteMany({ where: { coupleId } });
  await prisma.creditCard.deleteMany({ where: { coupleId } });
  await prisma.transaction.deleteMany({ where: { coupleId } });
  await prisma.category.deleteMany({ where: { coupleId } });
  await prisma.account.deleteMany({ where: { coupleId } });
  await prisma.pantryItem.deleteMany({ where: { coupleId } });

  await prisma.account.createMany({
    data: [
      { coupleId, name: "Efectivo", type: "CASH", balance: 5000 },
      { coupleId, name: "Ahorro BBVA", type: "SAVINGS", balance: 25000 },
      { coupleId, name: "Débito Nu", type: "CHECKING", balance: 8200 },
    ],
  });

  const accounts = await prisma.account.findMany({
    where: { coupleId },
  });
  const cash = accounts.find((item) => item.type === "CASH")!;
  const savings = accounts.find((item) => item.type === "SAVINGS")!;
  const checking = accounts.find((item) => item.type === "CHECKING")!;

  await prisma.category.createMany({
    data: [
      { coupleId, name: "Comida", type: "EXPENSE" },
      { coupleId, name: "Transporte", type: "EXPENSE" },
      { coupleId, name: "Casa", type: "EXPENSE" },
      { coupleId, name: "Salud", type: "EXPENSE" },
      { coupleId, name: "Ocio", type: "EXPENSE" },
      { coupleId, name: "Sueldo", type: "INCOME" },
      { coupleId, name: "Freelance", type: "INCOME" },
      { coupleId, name: "Ahorro", type: "SAVING" },
    ],
  });

  const categories = await prisma.category.findMany({ where: { coupleId } });
  const categoryByName = new Map(categories.map((category) => [category.name, category]));

  const dateForIndex = (index: number): Date => {
    const day = Math.min(now.getDate(), 1 + index * 2);
    return atMidday(new Date(now.getFullYear(), now.getMonth(), day));
  };

  await prisma.transaction.createMany({
    data: [
      { coupleId, type: "EXPENSE", amount: 850, date: dateForIndex(0), description: "Super semana", categoryId: categoryByName.get("Comida")!.id, accountId: checking.id },
      { coupleId, type: "EXPENSE", amount: 420, date: dateForIndex(1), description: "Gasolina", categoryId: categoryByName.get("Transporte")!.id, accountId: cash.id },
      { coupleId, type: "EXPENSE", amount: 350, date: dateForIndex(2), description: "Cine", categoryId: categoryByName.get("Ocio")!.id, accountId: checking.id },
      { coupleId, type: "EXPENSE", amount: 780, date: dateForIndex(3), description: "Farmacia", categoryId: categoryByName.get("Salud")!.id, accountId: checking.id },
      { coupleId, type: "EXPENSE", amount: 1150, date: dateForIndex(4), description: "Renta", categoryId: categoryByName.get("Casa")!.id, accountId: checking.id },
      { coupleId, type: "INCOME", amount: 8000, date: dateForIndex(5), description: "Sueldo quincena", categoryId: categoryByName.get("Sueldo")!.id, accountId: checking.id },
      { coupleId, type: "INCOME", amount: 3500, date: dateForIndex(6), description: "Pago freelance", categoryId: categoryByName.get("Freelance")!.id, accountId: checking.id },
      { coupleId, type: "INCOME", amount: 800, date: dateForIndex(7), description: "Venta usada", categoryId: categoryByName.get("Freelance")!.id, accountId: checking.id },
      { coupleId, type: "SAVING", amount: 2000, date: dateForIndex(8), description: "Ahorro mensual", categoryId: categoryByName.get("Ahorro")!.id, accountId: savings.id },
      { coupleId, type: "SAVING", amount: 1500, date: dateForIndex(9), description: "Fondo emergencia", categoryId: categoryByName.get("Ahorro")!.id, accountId: savings.id },
    ],
  });

  await prisma.creditCard.createMany({
    data: [
      { coupleId, name: "Nu", limitAmount: 15000, currentBalance: 3200, cutoffDay: 15, paymentDay: 5, interestRate: 45.5 },
      { coupleId, name: "BBVA", limitAmount: 30000, currentBalance: 8500, cutoffDay: 20, paymentDay: 10, interestRate: 38 },
    ],
  });

  const nuCard = await prisma.creditCard.findFirst({
    where: { coupleId, name: "Nu" },
  });
  if (!nuCard) throw new Error("No se pudo crear la tarjeta Nu");

  const installment = await prisma.installmentPlan.create({
    data: {
      coupleId,
      creditCardId: nuCard.id,
      description: "Celular",
      totalAmount: 12000,
      months: 6,
      monthlyAmount: 2000,
      startDate: monthStart,
    },
  });

  await prisma.installmentPayment.createMany({
    data: Array.from({ length: 6 }, (_, index) => ({
      planId: installment.id,
      number: index + 1,
      dueDate: addMonths(monthStart, index),
      paid: index < 2,
      paidAt: index < 2 ? atMidday(now) : null,
    })),
  });

  const debtDefinitions = [
    { name: "Préstamo coche", principal: 150000, annualRate: 12.5, startDate: atMidday(new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())), termMonths: 36 },
    { name: "Deuda familiar", principal: 20000, annualRate: 0, startDate: atMidday(new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())), termMonths: 10 },
  ];

  for (const debtDefinition of debtDefinitions) {
    const debt = await prisma.debt.create({
      data: { coupleId, ...debtDefinition },
    });
    const capital = debtDefinition.principal / debtDefinition.termMonths;
    let remaining = debtDefinition.principal;
    await prisma.debtPayment.createMany({
      data: Array.from({ length: debtDefinition.termMonths }, (_, index) => {
        const dueDate = addMonths(debtDefinition.startDate, index + 1);
        const interest = remaining * debtDefinition.annualRate / 100 / 12;
        const amount = capital + interest;
        remaining = Math.max(0, remaining - capital);
        const paid = dueDate <= now;
        return {
          debtId: debt.id,
          number: index + 1,
          dueDate,
          amount,
          principal: capital,
          interest,
          paid,
          paidAt: paid ? atMidday(dueDate) : null,
        };
      }),
    });
  }

  const investmentDefinitions = [
    {
      name: "CETES 28 días",
      type: "Renta fija",
      currentValue: 52000,
      annualRate: 11,
      interestType: "SIMPLE" as const,
      contributions: [
        { amount: 18000, date: atMidday(new Date(now.getFullYear(), now.getMonth() - 5, 10)), note: "Aportación inicial" },
        { amount: 12000, date: atMidday(new Date(now.getFullYear(), now.getMonth() - 2, 15)), note: "Aportación mensual" },
      ],
    },
    {
      name: "Fondo indexado",
      type: "Renta variable",
      currentValue: 38000,
      annualRate: 8.5,
      interestType: "COMPOUND" as const,
      contributions: [
        { amount: 12000, date: atMidday(new Date(now.getFullYear(), now.getMonth() - 6, 8)), note: "Inicio del fondo" },
        { amount: 10000, date: atMidday(new Date(now.getFullYear(), now.getMonth() - 3, 12)), note: "Aportación trimestral" },
        { amount: 9000, date: atMidday(new Date(now.getFullYear(), now.getMonth() - 1, 20)), note: "Rebalanceo" },
      ],
    },
    {
      name: "Bitcoin",
      type: "Cripto",
      currentValue: 15000,
      annualRate: null,
      interestType: "COMPOUND" as const,
      contributions: [
        { amount: 6000, date: atMidday(new Date(now.getFullYear(), now.getMonth() - 5, 5)), note: "Primera compra" },
        { amount: 5500, date: atMidday(new Date(now.getFullYear(), now.getMonth() - 2, 18)), note: "Promedio de costo" },
      ],
    },
  ];

  for (const definition of investmentDefinitions) {
    const investment = await prisma.investment.create({
      data: {
        coupleId,
        name: definition.name,
        type: definition.type,
        currentValue: definition.currentValue,
        annualRate: definition.annualRate,
        interestType: definition.interestType,
      },
    });
    await prisma.investmentContribution.createMany({
      data: definition.contributions.map((contribution) => ({
        investmentId: investment.id,
        amount: contribution.amount,
        date: contribution.date,
        note: contribution.note,
      })),
    });
  }

  const habitDefinitions = [
    { name: "Tomar agua", description: "Mantener hidratación durante el día", frequency: "DAILY" as const, timesPerWeek: null, daysOfWeek: [] as number[] },
    { name: "Ejercicio", description: "Entrenar tres veces por semana", frequency: "WEEKLY_X" as const, timesPerWeek: 3, daysOfWeek: [1, 3, 5] },
    { name: "Leer", description: "Leer al menos unos minutos", frequency: "DAILY" as const, timesPerWeek: null, daysOfWeek: [] as number[] },
    { name: "Meditar", description: "Practicar atención plena", frequency: "SPECIFIC_DAYS" as const, timesPerWeek: null, daysOfWeek: [1, 3, 5] },
  ];

  for (let habitIndex = 0; habitIndex < habitDefinitions.length; habitIndex++) {
    const definition = habitDefinitions[habitIndex];
    const habit = await prisma.habit.create({
      data: {
        coupleId,
        name: definition.name,
        description: definition.description,
        frequency: definition.frequency,
        timesPerWeek: definition.timesPerWeek,
        daysOfWeek: definition.daysOfWeek,
      },
    });

    const entries: Array<{ habitId: string; date: Date; completed: boolean }> = [];
    let completionIndex = habitIndex;
    for (let offset = 6; offset >= 0; offset--) {
      const date = atMidday(new Date(now));
      date.setDate(date.getDate() - offset);
      const dayOfWeek = date.getDay();
      const shouldCreate =
        definition.frequency === "DAILY" ||
        (definition.frequency === "WEEKLY_X" && [1, 3, 5].includes(dayOfWeek)) ||
        (definition.frequency === "SPECIFIC_DAYS" && definition.daysOfWeek.includes(dayOfWeek));

      if (shouldCreate) {
        entries.push({
          habitId: habit.id,
          date,
          completed: completionIndex % 2 === 0,
        });
        completionIndex++;
      }
    }
    await prisma.habitEntry.createMany({ data: entries });
  }

  await prisma.recipe.createMany({
    data: [
      { coupleId, name: "Avena con fruta", mealType: "BREAKFAST", ingredients: "Avena, leche, plátano, miel" },
      { coupleId, name: "Pollo con arroz", mealType: "LUNCH", ingredients: "Pechuga, arroz, verduras" },
      { coupleId, name: "Sopa de verduras", mealType: "DINNER", ingredients: "Zanahoria, papa, calabaza, cebolla" },
    ],
  });

  const recipes = await prisma.recipe.findMany({ where: { coupleId } });
  const recipeByName = new Map(recipes.map((recipe) => [recipe.name, recipe]));

  const weekStart = atMidday(new Date(now));
  const dayOffset = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - dayOffset);

  const mealPlan = await prisma.mealPlan.create({
    data: { coupleId, weekStart },
  });

  await prisma.mealPlanEntry.createMany({
    data: [
      { planId: mealPlan.id, dayOfWeek: 0, mealType: "LUNCH", recipeId: recipeByName.get("Pollo con arroz")!.id },
      { planId: mealPlan.id, dayOfWeek: 1, mealType: "BREAKFAST", recipeId: recipeByName.get("Avena con fruta")!.id },
      { planId: mealPlan.id, dayOfWeek: 2, mealType: "DINNER", recipeId: recipeByName.get("Sopa de verduras")!.id },
      { planId: mealPlan.id, dayOfWeek: 3, mealType: "LUNCH", recipeId: recipeByName.get("Pollo con arroz")!.id },
      { planId: mealPlan.id, dayOfWeek: 4, mealType: "BREAKFAST", recipeId: recipeByName.get("Avena con fruta")!.id },
    ],
  });

  await prisma.scheduleBlock.createMany({
    data: [
      { coupleId, title: "Trabajo", startTime: 540, endTime: 1080, daysOfWeek: [1, 2, 3, 4, 5], color: "#3B82F6" },
      { coupleId, title: "Gym", startTime: 1140, endTime: 1260, daysOfWeek: [1, 3, 5], color: "#10B981" },
      { coupleId, title: "Desayuno", startTime: 420, endTime: 480, daysOfWeek: [0, 1, 2, 3, 4, 5, 6], color: "#F59E0B" },
      { coupleId, title: "Reunión semanal", startTime: 600, endTime: 660, daysOfWeek: [1], color: "#8B5CF6" },
      { coupleId, title: "Tiempo pareja", startTime: 1200, endTime: 1320, daysOfWeek: [6], color: "#EC4899" },
    ],
  });

  await prisma.pantryItem.createMany({
    data: [
      { coupleId, name: "Leche", currentQty: 1, unit: "L", minStock: 2, expiresAt: atMidday(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)) },
      { coupleId, name: "Huevos", currentQty: 12, unit: "pz", minStock: 6, expiresAt: atMidday(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10)) },
      { coupleId, name: "Arroz", currentQty: 2, unit: "kg", minStock: 1, expiresAt: null },
      { coupleId, name: "Pan", currentQty: 1, unit: "pz", minStock: 0, expiresAt: atMidday(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)) },
      { coupleId, name: "Frijoles", currentQty: 3, unit: "kg", minStock: 1, expiresAt: null },
      { coupleId, name: "Aceite", currentQty: 0.5, unit: "L", minStock: 1, expiresAt: null },
      { coupleId, name: "Café", currentQty: 1, unit: "kg", minStock: 0.5, expiresAt: null },
      { coupleId, name: "Manzanas", currentQty: 6, unit: "pz", minStock: 3, expiresAt: atMidday(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5)) },
    ],
  });

  const counts = {
    Account: await prisma.account.count({ where: { coupleId } }),
    Category: await prisma.category.count({ where: { coupleId } }),
    Transaction: await prisma.transaction.count({ where: { coupleId } }),
    CreditCard: await prisma.creditCard.count({ where: { coupleId } }),
    InstallmentPlan: await prisma.installmentPlan.count({ where: { coupleId } }),
    InstallmentPayment: await prisma.installmentPayment.count({
      where: { plan: { coupleId } },
    }),
    Debt: await prisma.debt.count({ where: { coupleId } }),
    DebtPayment: await prisma.debtPayment.count({
      where: { debt: { coupleId } },
    }),
    Investment: await prisma.investment.count({ where: { coupleId } }),
    InvestmentContribution: await prisma.investmentContribution.count({
      where: { investment: { coupleId } },
    }),
    Habit: await prisma.habit.count({ where: { coupleId } }),
    HabitEntry: await prisma.habitEntry.count({
      where: { habit: { coupleId } },
    }),
    Recipe: await prisma.recipe.count({ where: { coupleId } }),
    MealPlan: await prisma.mealPlan.count({ where: { coupleId } }),
    MealPlanEntry: await prisma.mealPlanEntry.count({
      where: { plan: { coupleId } },
    }),
    ScheduleBlock: await prisma.scheduleBlock.count({ where: { coupleId } }),
    PantryItem: await prisma.pantryItem.count({ where: { coupleId } }),
  };

  console.log("Conteos del seed:");
  for (const [name, count] of Object.entries(counts)) {
    console.log(`${name}: ${count}`);
  }
}

main()
  .catch(async (error) => {
    console.error(error instanceof Error ? error.message : error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

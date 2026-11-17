-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EXPENSE', 'INCOME', 'TRANSFER', 'SAVING', 'INVESTMENT', 'DEBT_PAYMENT');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CHECKING', 'SAVINGS', 'INVESTMENT', 'CASH');

-- CreateEnum
CREATE TYPE "HabitFrequency" AS ENUM ('DAILY', 'WEEKLY_X', 'SPECIFIC_DAYS');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER');

-- CreateTable
CREATE TABLE "Couple" (
    "id" TEXT NOT NULL,
    "memberAId" TEXT NOT NULL,
    "memberBId" TEXT,
    "inviteCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debt" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "principal" DECIMAL(14,2) NOT NULL,
    "annualRate" DECIMAL(5,2) NOT NULL,
    "startDate" DATE NOT NULL,
    "termMonths" INTEGER NOT NULL,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtPayment" (
    "id" TEXT NOT NULL,
    "debtId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "dueDate" DATE NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "principal" DECIMAL(14,2) NOT NULL,
    "interest" DECIMAL(14,2) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "DebtPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "icon" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "accountId" TEXT,
    "creditCardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "limitAmount" DECIMAL(14,2) NOT NULL,
    "currentBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "cutoffDay" INTEGER NOT NULL,
    "paymentDay" INTEGER NOT NULL,
    "interestRate" DECIMAL(5,2),

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallmentPlan" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalAmount" DECIMAL(14,2) NOT NULL,
    "months" INTEGER NOT NULL,
    "monthlyAmount" DECIMAL(14,2) NOT NULL,
    "startDate" DATE NOT NULL,

    CONSTRAINT "InstallmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallmentPayment" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "dueDate" DATE NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "InstallmentPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "frequency" "HabitFrequency" NOT NULL DEFAULT 'DAILY',
    "timesPerWeek" INTEGER,
    "daysOfWeek" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitEntry" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HabitEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "currentValue" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentContribution" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "date" DATE NOT NULL,
    "note" TEXT,

    CONSTRAINT "InvestmentContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealType" "MealType" NOT NULL,
    "ingredients" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlanEntry" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "mealType" "MealType" NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "MealPlanEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PantryItem" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currentQty" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "minStock" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "expiresAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PantryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleBlock" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "daysOfWeek" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduleBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Couple_inviteCode_key" ON "Couple"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_memberAId_key" ON "Couple"("memberAId");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_memberBId_key" ON "Couple"("memberBId");

-- CreateIndex
CREATE INDEX "Debt_coupleId_idx" ON "Debt"("coupleId");

-- CreateIndex
CREATE UNIQUE INDEX "DebtPayment_debtId_number_key" ON "DebtPayment"("debtId", "number");

-- CreateIndex
CREATE INDEX "Account_coupleId_idx" ON "Account"("coupleId");

-- CreateIndex
CREATE INDEX "Category_coupleId_idx" ON "Category"("coupleId");

-- CreateIndex
CREATE INDEX "Transaction_coupleId_date_idx" ON "Transaction"("coupleId", "date");

-- CreateIndex
CREATE INDEX "Transaction_coupleId_type_idx" ON "Transaction"("coupleId", "type");

-- CreateIndex
CREATE INDEX "CreditCard_coupleId_idx" ON "CreditCard"("coupleId");

-- CreateIndex
CREATE INDEX "InstallmentPlan_coupleId_idx" ON "InstallmentPlan"("coupleId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentPayment_planId_number_key" ON "InstallmentPayment"("planId", "number");

-- CreateIndex
CREATE INDEX "Habit_coupleId_idx" ON "Habit"("coupleId");

-- CreateIndex
CREATE INDEX "HabitEntry_habitId_date_idx" ON "HabitEntry"("habitId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "HabitEntry_habitId_date_key" ON "HabitEntry"("habitId", "date");

-- CreateIndex
CREATE INDEX "Investment_coupleId_idx" ON "Investment"("coupleId");

-- CreateIndex
CREATE INDEX "InvestmentContribution_investmentId_date_idx" ON "InvestmentContribution"("investmentId", "date");

-- CreateIndex
CREATE INDEX "Recipe_coupleId_mealType_idx" ON "Recipe"("coupleId", "mealType");

-- CreateIndex
CREATE INDEX "MealPlan_coupleId_idx" ON "MealPlan"("coupleId");

-- CreateIndex
CREATE UNIQUE INDEX "MealPlan_coupleId_weekStart_key" ON "MealPlan"("coupleId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "MealPlanEntry_planId_dayOfWeek_mealType_key" ON "MealPlanEntry"("planId", "dayOfWeek", "mealType");

-- CreateIndex
CREATE INDEX "PantryItem_coupleId_idx" ON "PantryItem"("coupleId");

-- CreateIndex
CREATE INDEX "PantryItem_coupleId_expiresAt_idx" ON "PantryItem"("coupleId", "expiresAt");

-- CreateIndex
CREATE INDEX "ScheduleBlock_coupleId_idx" ON "ScheduleBlock"("coupleId");

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtPayment" ADD CONSTRAINT "DebtPayment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPlan" ADD CONSTRAINT "InstallmentPlan_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentPayment" ADD CONSTRAINT "InstallmentPayment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "InstallmentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitEntry" ADD CONSTRAINT "HabitEntry_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentContribution" ADD CONSTRAINT "InvestmentContribution_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanEntry" ADD CONSTRAINT "MealPlanEntry_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MealPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanEntry" ADD CONSTRAINT "MealPlanEntry_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryItem" ADD CONSTRAINT "PantryItem_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleBlock" ADD CONSTRAINT "ScheduleBlock_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

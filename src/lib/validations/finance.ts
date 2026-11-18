import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  type: z.enum(["CHECKING", "SAVINGS", "INVESTMENT", "CASH"]),
  balance: z.coerce.number().min(0, "El saldo no puede ser negativo"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER", "SAVING", "INVESTMENT", "DEBT_PAYMENT"]),
  icon: z.string().trim().optional(),
});

export const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER", "SAVING", "INVESTMENT", "DEBT_PAYMENT"]),
  amount: z.coerce.number().positive("El monto debe ser mayor a cero"),
  date: z.string().min(1, "La fecha es obligatoria").transform((value) => new Date(value)),
  description: z.string().trim().optional(),
  categoryId: z.string().optional(),
  accountId: z.string().optional(),
  creditCardId: z.string().optional(),
});
import { z } from "zod";

export const investmentSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  type: z.string().trim().optional(),
  currentValue: z.coerce.number().min(0, "El valor no puede ser negativo"),
});
export const contributionSchema = z.object({
  amount: z.coerce.number().positive("El aporte debe ser mayor a cero"),
  date: z.string().min(1, "La fecha es obligatoria").transform((value) => new Date(value)),
  note: z.string().trim().optional(),
});